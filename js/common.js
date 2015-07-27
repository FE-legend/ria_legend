/* Create by zhangmingxin at 2015/7/19*/

/**
 * 数据仓库 dataWarehouse ,用于存储通过ajax传递的数据以及本地的选择操作
 */


var data = {
	getItem: function(id) {
		return JSON.parse(localStorage.getItem(id));
	},
	setItem: function(id, obj) {
		obj = JSON.stringify(obj);
		localStorage.setItem(id, obj);
	},
	removeItem: function(id) {
		localStorage.removeItem(id);
	}
};

function getInitData(){
	var diaryBookArray = [], diaryObj = {};
	var note = {};
	var i = 0, len = localStorage.length;
	//localStorage.clear();
	for(; i < len; i++) {
		var key = localStorage.key(i);
		diaryBookArray.push(key);
		var value = data.getItem(key);
		diaryObj[key] = value;
	}
	console.log(diaryBookArray);
	console.log(diaryObj);
	return {
		diaryBook: diaryBookArray,
		diary: diaryObj
	};
}
var dataWH={
	NOTEBOOK: [],
	NOTE: {},
	CUR_NOTEBOOK: null,
	CUR_NOTE: 0,
	CRASH: {
		NBOOK: [],
		NT:{}
	}
};

var _this=null;

init();
/**
 * 初始化 
 * 指定一个 note对象作为全局对象，在所有可操作的文件中都起作用
 */
function init() {
	_this=this;
	window.note=_this;
	//将数据缓存起来
	dataWH.NOTEBOOK=getInitData().diaryBook;
	dataWH.NOTE=getInitData().diary;
	dataWH.CUR_NOTEBOOK=dataWH.NOTEBOOK[0];

	_this.initNoteCate();
}
//初始化笔记本
function initNoteCate() {
	if(!dataWH.NOTEBOOK.length){
		$('#cates').empty();
		return;
	}
	var cates=$("#cates");
	cates.empty();
	var len=dataWH.NOTEBOOK.length;
	for(var i=0;i<len;i++) {
		if(!dataWH.NOTE[dataWH.NOTEBOOK[i]]){ //判断相应笔记本是否为空
			cates.append(_this.htmlModel().noteBookModel(dataWH.NOTEBOOK[i],0));
		}else{
			cates.append(_this.htmlModel().noteBookModel(dataWH.NOTEBOOK[i],dataWH.NOTE[dataWH.NOTEBOOK[i]].length));
		} 	
		if(dataWH.CUR_NOTEBOOK===dataWH.NOTEBOOK[i]) {
			$("#cates>li:eq("+i+")").css("color","red");	
			_this.initNoteThumb(dataWH.NOTEBOOK[i]);
		}
	}
}
//初始化笔记列表
function initNoteThumb(data) {
	if(!dataWH.NOTE[data]) {
		_this.initNoteDetail(dataWH.NOTE[data]);
		$('#notes').empty();
		return;
	}
	dataWH.CUR_NOTEBOOK=data;
	var notes=$("#notes");
	notes.empty();
	var len=dataWH.NOTE[data].length;
	if(len===0){
		$("#noteDetail").empty();
		_this.router("noteDetail",1);
	}
	for(var i=0;i<len;i++) {
		var value=dataWH.NOTE[data][i];
		if(i===0){
			dataWH.CUR_NOTE=i;
			_this.initNoteDetail(value);
		}
		notes.append(_this.htmlModel().noteModel(value.title,value.time,value.content,data));
	}
}
//初始化笔记内容
function initNoteDetail(data){
	if(!data){
		$("#noteDetail").empty();
		return;
	}
	var noteDetail=$("#noteDetail");
	noteDetail.empty();
	noteDetail.append(_this.htmlModel().detaileModel(data.title,data.time,data.content));
}
//选择笔记本
function selectNoteCate(e){
	$(e).css("color","red").siblings("li").css("color","#CCC");
	var data=$(e).children("span").text();
	dataWH.CUR_NOTEBOOK=data;
	_this.initNoteThumb(data);
}
//选择笔记
function selectNoteThumb(e){
	$("#noteDetail").css("display","block");
	$("#noteEdit").css("display","none");
	var data1=$(e).children("h6").text();
	var notes=$("#notes>li");
	for(var i=0;i<notes.length;i++){
		var data2=notes.eq(i).children("h6").text();
		if(data2===data1){
			dataWH.CUR_NOTE=i;
			_this.initNoteDetail(dataWH.NOTE[dataWH.CUR_NOTEBOOK][i]);
		}
	}
}
//添加笔记本
function addNoteCate(type) {
	switch(type) {
		case 0:
			$("#cates>div").remove(); //取消添加
			break;
		case 1:  //添加按钮
		var cates=$("#cates");
			cates.children("div").remove();
			cates.append(_this.htmlModel().addnoteBookModel());
			break;
		case 2: //确认
			var noteB=$("#noteB").val().trim();
			if(noteB===""){
				return;
			}
			dataWH.CUR_NOTEBOOK=noteB;
			dataWH.NOTEBOOK.push(noteB);
			dataWH.NOTE[noteB]=[];
			_this.initNoteCate();

			//存储数据
			data.setItem(dataWH.CUR_NOTEBOOK, []);
			break;
	}
}
//新建笔记
function noteNew(){
	_this.router("noteEdit",1);
	_this.router("edit",0);
	$("#editBtn").addClass("activeSpan").siblings("span").removeClass("activeSpan");
}
//编辑笔记	
function noteEdit(e){
	console.log(e);
	_this.router("edit",0);
	$(e).addClass("activeSpan").siblings("span").removeClass("activeSpan");
}
//笔记解析
function noteview(e){
	_this.router("view",0);
	$(e).addClass("activeSpan").siblings("span").removeClass("activeSpan");
	//在这里添加解析内容
	var tit=$("#noteTitle").val().trim();
	var con=$("#noteContent").val().trim();
	var view=$("#view");
	view.empty();
	view.append(_this.htmlModel().viewModel(tit,con));
}
//取消新建笔记
function cancelNew(){
		var tit=$("#noteTitle").val().trim();
		var con=$("#noteContent").val().trim();
		if(tit!=""||con!=""){
			if(confirm("确认取消操作？？？")){
				$("#noteTitle").val("");
				$("#noteContent").val("");
				$("#view").empty();
				_this.router("noteDetail",1);
			}
		}else{
				$("#view").empty();
			_this.router("noteDetail",1);
		}
}
//确认新建笔记或修改笔记
function affirmNew(){
	var tit=$("#noteTitle").val().trim();
	var con=$("#noteContent").val().trim();
	var time=getCurTime();
	if(tit===""||con===""){
		alert("请确认内容或者标题非空！");
	}else{
		if($('#edit_con')[0].innerText === '确定') {
			dataWH.NOTE[dataWH.CUR_NOTEBOOK].push({"title":tit,"content":con,"time":time});
			_this.initNoteCate();
		}
		else if($('#edit_con')[0].innerText === '修改') {
			console.log(dataWH.CUR_NOTEBOOK);
			dataWH.NOTE[dataWH.CUR_NOTEBOOK][dataWH.CUR_NOTE] = {"title":tit,"content":con,"time":time};
			$('#edit_con')[0].innerText = '确定';
			_this.initNoteCate();
		}
		$("#noteTitle").val("");
		$("#noteContent").val("");
		$("#view").empty();
		_this.router("noteDetail",1);
		//存储
		data.setItem(dataWH.CUR_NOTEBOOK, dataWH.NOTE[dataWH.CUR_NOTEBOOK]);
	}
}
// 删除笔记
function removeNote(){
	if(confirm("确认删除："+dataWH.NOTE[dataWH.CUR_NOTEBOOK][dataWH.CUR_NOTE].title)){
		//1.从笔记中删除
		for(var i=0;i<dataWH.NOTE[dataWH.CUR_NOTEBOOK].length;i++){
			console.log(dataWH.NOTE[dataWH.CUR_NOTEBOOK][i].title);
			if(dataWH.NOTE[dataWH.CUR_NOTEBOOK][i].title===dataWH.NOTE[dataWH.CUR_NOTEBOOK][dataWH.CUR_NOTE].title){
					dataWH.NOTE[dataWH.CUR_NOTEBOOK].splice(i,1);
			}
		}
		_this.initNoteCate();
		data.setItem(dataWH.CUR_NOTEBOOK, dataWH.NOTE[dataWH.CUR_NOTEBOOK]);
	}else{
		// do nothing 不做删除
	}
}
//修改笔记
function editNote(){
	noteNew();
	var curNote = dataWH.NOTE[dataWH.CUR_NOTEBOOK][dataWH.CUR_NOTE];
	$("#noteTitle").val(curNote.title);
	$("#noteContent").val(curNote.content);
	$('#edit_con')[0].innerText = '修改';
}
//删除笔记分类
function removeNoteBook(){

	if(confirm('删除该分类？')){
		delete dataWH.NOTE[dataWH.CUR_NOTEBOOK];

		var notebookArray = dataWH.NOTEBOOK;
		for(var i = 0, len = notebookArray.length; i < len; i++) {
			if(notebookArray[i] == dataWH.CUR_NOTEBOOK) {
				notebookArray.splice(i,1);
			}
		}
		dataWH.NOTEBOOK = notebookArray;


		_this.initNoteCate();
		//移除存储
		data.removeItem(dataWH.CUR_NOTEBOOK);
	}
}
function router(data,cont){
	var tag;
	switch (cont){
		case 0:
			tag=["edit","view"];
			break;
		case 1:
			tag=["noteDetail","noteEdit"];
			break;
		default:
			break;
	}
	for(var i=0;i<tag.length;i++){
		if(tag[i]===data){
			$("#"+data).show();
		}else{
			$("#"+tag[i]).hide();
		}
	}
}
/**
 * html 模板
 */
function htmlModel() {
	var hModel= {
		"noteBookModel": function(title,num) {
			return '<li onclick="note.selectNoteCate(this)" data-id="">'+
								'<span>'+title+'</span>'+
								'<i>(<strong>'+num+'</strong>)</i>'+
					            '<i class="icon-remove" onclick="removeNoteBook()"></i>'+
							'</li>';
		},
		"noteModel": function(title,time,content,notebook) {
			return '<li onclick="note.selectNoteThumb(this)">'+
								'<h6>'+title+'<span>'+time+'</span><span class="hiddenSpan">'+notebook+'</span></h6>'+
								marked(content)+
							'</li>';
		},
		"detaileModel": function(title,time,content) {
			return '<header>'+
								'<h1 class="detail-title">'+title+'<i class="icon-wrap"><i class="icon-edit" onclick="editNote()"></i><i class="icon-remove" onclick="note.removeNote();"></i></i><br/><span class="detail-time">'+time+'</span></h1>'+
							'</header>'+
						 '<article>'+
						 		'<div class="note-content">'+marked(content)+'</div>'+
						 	'</article>';
		},
		"addnoteBookModel": function(){
			return '<div><input id="noteB" type="text">'+
								'<i onclick="note.addNoteCate(2)" class="icon-ok"></i><i onclick="note.addNoteCate(0)" class=" icon-share-alt"></i>'+
							'</div>';
		},
		"viewModel": function(title,content){
			console.log('view');
			return '<h3>'+title+'</h3><div>'+marked(content)+'</div>';
		}
	};
	return hModel;
}

/**
 *如果不是本地操作，就调用这个函数获取数据
 */
function ajax(action,param,callback,hideLoad){
	$.ajax({
		url: action,
		data: param,
		dataType: 'JSONP',
		jsonpCallback: 'processJSON',
		type: 'GET',
		success: function (data) {
      callback(data);
    },
    error: function(xhr, type){
    	callback(type);
    }
	});
}



/*      support      */
function getCurTime() {
	var date = new Date;
	return addZero(date.getFullYear()) + '-' + addZero(date.getMonth() + 1) + '-' + addZero(date.getDate());
}
function addZero(i) {
	i = Math.abs(i - 0);
	return i >= 10 ? +i : '0' + i;
}