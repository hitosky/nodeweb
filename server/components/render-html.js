/*
* 将请求的ejs文件经过渲染后返回html
*/

var ejs = require('ejs');
var fs = require('fs');

var route = require('../route.js');
function renderHtml(path,data){
	path=path.replace(/^\/*/,'/').replace(/\/*$/,'').replace(/\/+/g,'/');
	var html = '<h1>404 not found</h1>';
	if(route[path]){ 
		try{
			var str = fs.readFileSync(route[path],'utf8');
			html = ejs.render(str,data);
		}
		catch(e){
			console.error(e);
		}
	}
	return html;
}

module.exports = {
	renderHtml : renderHtml
};
