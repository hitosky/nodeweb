/*
* 预处理请求
*/
const path = require('path');
const fileOp = require(path.join(global.pathConfig.serverPath,'components/file-operation'));

module.exports = {
	process304: function (_this){
      var req = _this.request;	
       return new Promise(function(resolve,reject){
          let ifModified = req.headers['if-modified-since'];
          let lastModified = fileOp.readLastModified(req.path);
			// 如果文档未修改则返回304	
          if(ifModified && ifModified == lastModified){
              _this.status = 304;
              resolve();
          }   
			// 如果文档改变了则返回200并设置cache-control和last-modified
          else {
              _this.status = 200;
              _this.set('Cache-Control','max-age=60*60*24');
              _this.set('Last-Modified',lastModified);
              reject();
          }
      });
	}
};
