/*
* 线上后台开发
*/
// 内置模块
var koa = require('koa');
var koaStatic = require('koa-static');
var webpack = require('webpack');
var path = require('path');
// 外部引入模块
var pathConfig = require('../path-config');
var renderHtml = require('./components/render-html');
var koaMW = require('./components/koa-middleware');
var wpConfig = require(path.join(pathConfig.webpackPath,'webpack.config.js'));
var koaApp = koa();
// 静态目录
koaApp.use(koaStatic(pathConfig.staticPath));

var port = 80;
var middlewares = [];
middlewares.push(function*(){
	var req = this.req;
	var html = 	renderHtml.renderHtml(req.url,{});	
	this.body=html;
});
koaMW.registerMiddlewares(koaApp,middlewares);
koaApp.listen(port);	
