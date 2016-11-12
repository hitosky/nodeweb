/*
* 页面路由配置
*/
const path = require('path');
var appPath = global.pathConfig.appPath;

// 获取mock文件路径
function getMock(relativePath){
	return path.join(appPath,relativePath);
}
module.exports = {

	// 正常页面接口
	// example
	'/': getMock('pages/home/index.ejs'),

	// 异步接口GET
	// example
	'/home/log' : getMock('/pages/home/mock/log.json'),

	// 异步接口POST
	// example
	'POST::/article-crawler/search': getMock('/pages/article-crawler/mock/search.json')
}
