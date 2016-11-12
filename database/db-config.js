/*
* 连接数据库的配置文件
*/
module.exports = {
	host : 'localhost',
	port : ,
	user : ,
	password : ,
	database : ,
	// 最大连接数限制
	connectionLimit : 100,
	// 没有空闲连接是否等待
	waitForConnections : true,
    // 将数据库date类型返回成string类型
    dateStrings: true
};
