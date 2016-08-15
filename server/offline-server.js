/*
* 线下后台开发
*/
// 内置模块
var koa = require('koa');
var koaStatic = require('koa-static');
var webpack = require('webpack');
var path = require('path');
var bs = require('browser-sync').create();
// 外部引入模块
var pathConfig = require('../path-config');
var renderHtml = require('./components/render-html');
var koaMW = require('./components/koa-middleware');
var wpConfig = require(path.join(pathConfig.webpackPath,'webpack.config.js'));
var koaApp = koa();
// 静态目录
koaApp.use(koaStatic(pathConfig.staticPath));
// 监听app下的文件改变
bs.watch(pathConfig.appPath).on('change',function(){
	// webpack成功后刷新页面
	webpack(wpConfig,function(){
		bs.reload();
	});
});

var port = 1234;
var middlewares = [];
middlewares.push(function*(){
	var req = this.req;
	var html = 	renderHtml.renderHtml(req.url,{title:113});	
	this.body=html;
});
koaMW.registerMiddlewares(koaApp,middlewares);
bs.init({proxy:'http://localhost:'+port},function(){
	koaApp.listen(port);	
});
