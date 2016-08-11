/*
* 如果有多个use中间件，可以一次性注册成功，不必每个都app.use
*/
'use strict'
function registerMiddlewares(app,middlewares){
	for(var mw of middlewares){
		app.use(mw);
	}
}
module.exports = {
	registerMiddlewares : registerMiddlewares
};
