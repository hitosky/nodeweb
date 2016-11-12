/*
* 项目路径配置
*/
var path = require('path');
var	projectPath = __dirname;
module.exports = {
	projectPath : projectPath,  // 项目根目录
	appPath : path.join(projectPath,'app'),  // 应用目录
	serverPath : path.join(projectPath,'server'),  // 后台目录
	staticPath : path.join(projectPath,'build'),   // 静态资源目录
	webpackPath : path.join(projectPath,'webpack-config'),    // webpack配置目录
	urlPath : path.join(projectPath,'app/pages'),    // 页面url路径
	dbPath : path.join(projectPath,'database'),     // 数据库相关文件路径
	logPath: path.join(projectPath,'log'),    // 日志文件目录
	scriptPath : path.join(projectPath,'script')    // 脚本文件目录
};
