/*
* 线下后台开发
*/
'use strict'
// 内置模块
const koa = require('koa');
const koaStatic = require('koa-static');
const gzip = require('koa-gzip');
const koaBody = require('koa-body')();
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const bs = require('browser-sync').create();
// 外部引入模块
global.pathConfig = require('../path-config');
const pathConfig = global.pathConfig;
const fileOp = require('./components/file-operation');
const koaMW = require('./components/koa-middleware');
const wpConfig = require(path.join(pathConfig.webpackPath,'webpack.config.js'));
const route = require('./route');
const sql = require(path.join(pathConfig.dbPath,'sql'));
const koaApp = koa();

// accept-encoding 压缩方式gzip
koaApp.use(gzip());
// 静态服务器
koaApp.use(koaStatic(pathConfig.staticPath));
// 解析request body
koaApp.use(koaBody);
// 监听app下的文件改变
bs.watch(pathConfig.appPath).on('change',function(){
	// webpack成功后刷新页面
	webpack(wpConfig,function(err,stats){
		if(err || stats.hasErrors()){
			console.log(stats.toString());
		}
		console.log('webpack repack');
		bs.reload();
	});
});

var port = 1234;
var middlewares = [];
var urlPath;  //经过处理的页面路径
middlewares.push(function*(next){
    let req = this.request;
	urlPath = req.path;
	if(req.method == 'POST'){	
		urlPath = 'POST::'+urlPath;
	}
    if(route[urlPath]) {
		// 如果是异步请求则直接返回json数据
		if(/\.json$/.test(route[urlPath])){
			console.log(require(route[urlPath]));
			this.body = require(route[urlPath]);
		}
		// 如果是同步请求则返回渲染后的html
		else{
        	let data = yield next;
        	this.body = fileOp.renderHtml(urlPath, data);
		}
    }
    else{
        this.status = 404;
        this.body = '<h1>404 Not Found</h1>';
    }

});

// 读取index.json
middlewares.push(function*(next){
	let n = route[urlPath].search(/\.ejs$/) > -1 ? -3 : -4;
    let jsonPath = route[urlPath].slice(0, n) + 'json';
    let data = {};
    try {
        let stat = fs.statSync(jsonPath);
        if (stat && stat.isFile()) {
            data = require(jsonPath);
        }
    }catch(e){};
    return data;
});


koaMW.registerMiddlewares(koaApp,middlewares);
bs.init({proxy:'http://localhost:'+port},function(){
	webpack(wpConfig,function(err,stats){
		if(err || stats.hasErrors()){
			console.log(stats.toString());
		}
		else{
			console.log('webpack success');
		}
	});
	koaApp.listen(port);
});


