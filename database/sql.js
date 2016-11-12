/*
* 数据库操作
*/
var mysql = require('mysql');
var config = require('./db-config.js');

var pool = mysql.createPool(config);

function sql(queryString,next){
	pool.getConnection(function(err,connection){
		if(err){
			console.error('fail to connect to database ');
			next(err);
			return;
		}
		connection.query(queryString,function(err,rows){
			connection.release(function(err){
				if(err){
					console.error('fail to release connection');
				}
			});
			if(err){
				console.error('query failed:'+err);
				next(err);
				return;
			}
			next(null,rows);
		});
	});
}

// 执行查询语句
function doSql(queryString){
	return new Promise(function(resolve,reject){
		sql(queryString,function(err,rows){
			if(err){
				reject(err);
			}
			else{
				resolve(rows);
			}
		});
	});
}
// 关闭连接池
function closePool(time){
    setTimeout(function(){
        pool.end();
    },time*1000);
}

module.exports = {
	doSql : doSql,
    closePool : closePool
};

