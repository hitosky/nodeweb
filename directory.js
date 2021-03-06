/*
* 项目路径配置
*/
var path = require('path')
var projectPath = __dirname
module.exports = {
	projectPath: projectPath,  // 项目根目录
	appPath: path.join(projectPath, 'app'),  // 应用目录
	serverPath: path.join(projectPath, 'server'),  // 后台目录
	mockPath: path.join(projectPath, 'mock'),
	buildPath: path.join(projectPath, 'build'),   // 静态资源目录
	configPath: path.join(projectPath, 'config'),    // 配置目录
	logPath: path.join(projectPath, 'log'),    // 日志文件目录
	scriptPath: path.join(projectPath, 'scripts')    // 脚本文件目录
}
