/* Create by zhangmingxin at 2015/7/19*/

/**
 * 数据仓库 dataWarehouse ,用于存储通过ajax传递的数据以及本地的选择操作
 */
var dataWH={
	NOTEBOOK: "",
	NOTE: "",
	CUR_NOTEBOOK: "",
	CUR_NOTE: ""
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
	dataWH.NOTEBOOK=diaryBook;
	dataWH.NOTE=diary;
	dataWH.CUR_NOTEBOOK=dataWH.NOTEBOOK[0];
	dataWH.CUR_NOTE=dataWH.NOTE[dataWH.NOTEBOOK[0]][0];

	_this.initNoteCate();
}
//初始化笔记本
function initNoteCate() {
	if(!dataWH.NOTEBOOK){
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
			_this.initNoteDetail(value);
		}
		notes.append(_this.htmlModel().noteModel(value.title,value.time,value.content,data));
	}
}
//初始化笔记内容
function initNoteDetail(data){
	if(!data){
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
//确认新建笔记
function affirmNew(){
	var tit=$("#noteTitle").val().trim();
	var con=$("#noteContent").val().trim();
	if(tit===""||con===""){
		alert("请确认内容或者标题非空！");
	}else{
		dataWH.NOTE[dataWH.CUR_NOTEBOOK].push({"title":tit,"content":con,"time":"2015/9/10"});
		_this.initNoteCate();
		$("#noteTitle").val("");
		$("#noteContent").val("");
		$("#view").empty();
		_this.router("noteDetail",1);
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
			return '<li onclick="note.selectNoteCate(this)">'+
								'<span>'+title+'</span>'+
								'<i>(<strong>'+num+'</strong>)</i>'+
							'</li>';
		},
		"noteModel": function(title,time,content,notebook) {
			return '<li onclick="note.selectNoteThumb(this)">'+
								'<h6>'+title+'<span>'+time+'</span><span class="hiddenSpan">'+notebook+'</span></h6>'+
								'<p>'+content+'</p>'+
							'</li>';
		},
		"detaileModel": function(title,time,content) {
			return '<header>'+
								'<h1>'+title+'<i class="icon-remove"></i><br/><span>'+time+'</span></h1>'+
							'</header>'+
						 '<article>'+
						 		'<div class="note-content"><p>'+content+'</p></div>'+
						 	'</article>';
		},
		"addnoteBookModel": function(){
			return '<div><input id="noteB" type="text">'+
								'<span onclick="note.addNoteCate(2)">确认</span><span onclick="note.addNoteCate(0)">取消</span>'+
							'</div>';
		},
		"viewModel": function(title,content){
			return '<h3>'+title+'</h3><div><p>'+content+'</p></div>';
		}
	};
	return hModel;
};

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