/*
* 连接数据库的配置文件
*/
module.exports = {
	host : 'localhost',
	port : 3306,
	user : 'root',
	password : '123',
	database : 'hackweb',
	// 最大连接数限制
	connectionLimit : 100,
	// 没有空闲连接是否等待
	waitForConnections : true
};
