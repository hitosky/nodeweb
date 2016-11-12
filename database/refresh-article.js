/**
 * Created by chongya on 16-8-25.
 */

/*
* 自动更新新增的html文件到数据库
*/
'use strict'
var fs = require('fs');
var path = require('path');
var sql = require('./sql.js');
var pathConfig = require('../path-config');
var staticPath = '/static';

// 定时查看静态目录有无html文件更新
setTimeout(function(){
    // 先从article表中读取出已有的文件
    var sqlPromise = sql.doSql('select article_title from article;');
    sqlPromise.then(function(rows){
        let oldFiles = [];
        rows.forEach(function(row,index){
            oldFiles[index] = row['article_title'];
        });
        return oldFiles;
    }).then(function (oldFiles) {
        // 读取静态目录下的文件
        fs.readdir(path.join(pathConfig.staticPath,staticPath),function(err,files){
            if(err){
                console.error(err);
                return;
            }
            if(oldFiles != files){
                let fileObj = {};
                for(let file of oldFiles){
                    fileObj[file] = file;
                }
                for(let file of files){
                    var fileName = file.replace('.html','');
                    // 如果是html文件并且是新增的文件，则插入到article表中
                    if( file.indexOf('.html') > -1 && !(fileName in fileObj)){
                        var query = "insert into article (article_title,article_path) values ('"+fileName+"'"+",'"+path.join(staticPath,file)+"');";
                        sqlPromise = sql.doSql(query);
                    }
                    // 已存在的文件从fileObj中删除
                    else if(fileName in fileObj){
                        delete fileObj[fileName];
                    }
                }

                // 如果article表中文件不存在，则删除该条记录
                for(fileName in fileObj ){
                    query = 'delete from article where article_title='+fileName+';';
                    sql.doSql(query);
                }
                // 3秒后断开连接
                sql.closePool(3);
            }
        });
    });

},1000);


