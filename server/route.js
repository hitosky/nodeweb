/*
* 页面路由配置
*/
var path = require('path');
var pathConfig = require('../path-config');
var appPath = pathConfig.appPath;
module.exports = {
	'/article' : path.join(appPath,'/pages/article/index.ejs') 
}
