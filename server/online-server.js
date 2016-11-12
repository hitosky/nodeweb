/*
* 线上后台开发
*/
// 内置模块
const koa = require('koa');
const koaStatic = require('koa-static');
const koaRouter = new require('koa-router')();
const koaBody = new require('koa-body')();
const webpack = require('webpack');
const path = require('path');
// 外部引入模块
global.pathConfig = require('../path-config');
var pathConfig = global.pathConfig;
var fileOp = require('./components/file-operation');
var koaMW = require('./components/koa-middleware');
var wpConfig = require(path.join(pathConfig.webpackPath,'webpack.config.js'));
var route = require('./route');
var sql = require(path.join(pathConfig.dbPath,'sql'));
var koaApp = koa();
// 静态服务器
koaApp.use(koaStatic(pathConfig.staticPath));
// 路由
koaApp.use(koaRouter.routes()).use(koaRouter.allowedMethods());

var port = 80;
var middlewares = [];
var urlPath;

// 设置路由controller
require('./components/router')(koaRouter,koaBody);

koaMW.registerMiddlewares(koaApp,middlewares);
koaApp.listen(port);
