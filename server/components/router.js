/*
* 将url定位到相应的控制层中
*/
const path = require('path');
const glob = require('glob');

// 控制层文件夹路径 
var controllerPath = path.join(global.pathConfig.serverPath,'controller');

module.exports = function (koaRouter,koaBody){
	// 控制层文件夹下所有js文件
	let router = glob.sync(path.join(controllerPath,'**/*.js'));
	router = router.map(function(route,index){
		// 控制层文件相对路径
		let chunkFile = path.relative(controllerPath,route);
		// 控制层文件名称（不包含后缀）
		let baseName = path.basename(chunkFile,'.js');
		// 控制层文件相对目录
		let dirName = path.dirname(chunkFile);
		// 如果控制层文件名含有'index'字段，则匹配的url路径即为相对目录;反之，匹配的文件路径为相对路径(不包含后缀)
		let url =path.join('/',baseName.indexOf('index') > -1 ? dirName : chunkFile.slice(0,-3));
		return {'url':url,'route':route};
	});
	// '/' 跳转到'/home'
	koaRouter.all('/',function *(){
		this.redirect('/home');
		this.status = 301;
	});
	router.forEach(function(route,index){
		let url = route['url'];
		let generators = require(route['route']);
		generators.unshift(koaBody);
		generators.unshift(url);
		
		// 为每个请求设置响应
		koaRouter.all.apply(koaRouter,generators);
		/*generators.forEach(function(gen,index){
			koaRouter.all(url,koaBody,gen);
		});*/
	});
};
