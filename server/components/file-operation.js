/*
* 文件操作，包括渲染ejs页面以及reactdom等
*/

const ejs = require('ejs');
const fs = require('fs');

var route = require('../route.js');
// 返回渲染后的html
function renderHtml(path,data){
	var html = '';
	if(route[path]){
		try{
			var str = fs.readFileSync(route[path],'utf8');
            // 如果是ejs模板
            if(route[path].indexOf('.ejs')>-1) {
                html = ejs.render(str, data);
            }
		}
		catch(e){
			console.error(e);
		}
	}
	return html;
}
// 返回文件最后修改时间
function readLastModified(path){
    return route[path] ? (fs.statSync(route[path])).mtime.toUTCString() : new Date().toUTCString();
}

module.exports = {
	renderHtml : renderHtml,
    readLastModified: readLastModified
};
