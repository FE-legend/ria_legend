/**
 * json 格式的数据 ，用于本地操作
 * 同时，若链接服务器，可直接使用ajax返回相同格式的数据即可用来操作和显示
 * Create by zhangmingxin at 2015/7/19
 */
var diaryBook=["设计","体育锻炼","html5"];
var diary= {
	"设计": [
		{
			"title": "第一个设计",
			"content": "这是我的第一个设计，我用它做什么用----",
			"time": "2015/7/10"
		},
		{
			"title": "第二个设计",
			"content": "这是我的第二个设计，我用它做什么用----",
			"time": "2015/7/19"
		}
	],
	"体育锻炼": [
		{
			"title": "参加锻炼",
			"content": "在体育馆，做了一天一夜的深蹲",
			"time": "2014/9/12"
		}
	],
	"html5": [
		{
			"title": "doctype",
			"content": "doctype规定了html文档类型",
			"time": "2015/9/11"
		},
		{
			"title": "canavas",
			"content": "html5的新功能，非常棒！！！",
			"time": "2015/3/21"
		},
		{
			"title": "学习html5",
			"content": "自从。。。。开始学习html5，最近。。。以后。。",
			"time": "2015/9/10"
		}
	]
};
