/*
* 数据库操作
*/
var mysql = require('mysql');
var config = require('./db-config.js');

var pool = mysql.createPool(config);

function sql(queryString,next){
	var result = true;
	pool.getConnection(function(err,connection){	
		if(err){
			console.error('error connecting:'+err.stack);
			result = false;
			return;
		}
		console.log('connect successfully');
		connection.query(queryString,function(err,rows){
			if(err){
				console.error('sql query execute error:'+err.stack);
				result = false;
				return;
			}
			console.log('sql query execute successfully');
			next(rows);
		});	
	});
	return result;
}

module.exports = {
	sql : sql
};
