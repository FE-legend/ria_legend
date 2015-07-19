

var _this=null;
var NOTE=diaryBook[0];
init();
/**
 *初始化
 */
function init() {
	_this=this;
	window.note=_this;
	_this.initNoteCate();
}
/**
 *初始化笔记本
 */
function initNoteCate() {
	if(!diaryBook){
		return;
	}
	var cates=$("#cates");
	var len=diaryBook.length;
	for(var i=0;i<len;i++) {
		if(i===0) {
			_this.initNoteThumb(diaryBook[i]);
		}
	 	cates.append(_this.htmlModel().noteBookModel(diaryBook[i],diary[diaryBook[i]].length));
	}
}
/**
 *初始化笔记列表
 */
function initNoteThumb(data) {
	if(!diary[data]) {
		return;
	}
	NOTE=data;
	var notes=$("#notes");
	notes.empty();
	var len=diary[data].length;
	for(var i=0;i<len;i++) {
		var value=diary[data][i];
		if(i===0){
			_this.initNoteDetail(value);
		}	
		console.log(data);
		notes.append(_this.htmlModel().noteModel(value.title,value.time,value.content,data));
	}
}
/**
 *	初始化笔记内容
 */
function initNoteDetail(data){
	console.log(data);
	if(!data){
		return;
	}
	var noteDetail=$("#noteDetail");
	noteDetail.empty();
	noteDetail.append(_this.htmlModel().detaileModel(data.title,data.time,data.content));
}
/**
 *选择笔记本
 */
function selectNoteCate(e){
	var data=$(e).children("span").text();
	_this.initNoteThumb(data);
}
/**
 *选择笔记
 */
function selectNoteThumb(e){
	$("#noteDetail").css("display","block");
	$("#noteEdit").css("display","none");
	var data1=$(e).children("h6").text();
	var notes=$("#notes>li");
	for(var i=0;i<notes.length;i++){
		var data2=notes.eq(i).children("h6").text();
		if(data2===data1){
			_this.initNoteDetail(diary[NOTE][i]);
		}
	}
}
/**
 * 新建笔记
 */
function noteEdit(){
	$("#noteDetail").css("display","none");
	$("#noteEdit").css("display","block");
	$("#editBtn").click(function(){
		$("#edit").show();
		$("#view").hide()
	});
	$("#viewBtn").click(function(){
		$("#edit").hide();
		$("#view").show();
	});
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
		}
	};
	return hModel;
};