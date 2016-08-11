/*
* 将请求的ejs文件经过渲染后返回html
*/

var ejs = require('ejs');
var route = require('../route.js');
function renderHtml(path,data){
	path=path.replace(/^\/*/,'/').replace(/\/*$/,'').replace(/\/+/g,'/');
	return route[path] ?  ejs.render({url:route[path]},data):'<h1>404 not found</h1>'; 
}

module.exports = {
	renderHtml : renderHtml
};
