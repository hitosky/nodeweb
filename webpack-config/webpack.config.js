var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// 入口文件
var entry = {};
// 项目根目录
var root = path.join(__dirname,'../');
// 应用目录
var srcPath = path.join(root,'app');
// 打包文件输出路径
var buildPath = path.join(root,'build');
// 匹配common或者pages下的所有js文件
glob.sync(path.join(srcPath,'{common,pages}/**/*.js')).forEach(function(filePath){
	// chunk为js文件在srcPath下的相对路径
	var chunk = path.relative(srcPath,filePath).slice(0,-3);
	entry[chunk]=chunk;
});
entry['index'] = [];
var publicPath = '/build/';
// node_modules可能所在的所有文件路径
var modulesDirectories = module.path;
var config = {
	debug : true,
	context : srcPath,
	entry : entry,
	output : {
		path : buildPath,
		pathinfo : true,
		publicPath : publicPath,
		filename : '[name].js',
		chunkFilename : '[name].js'   //非入口文件的输出文件
	},
	resolve : {
		root : srcPath,
	//	extensions : ['.js','.jsx','.less'], // 文件扩展名
		// 常用模块的编译路径，可以提高搜索效率
		alias : {
			c : path.join(srcPath,'components')
		}
	},
	// 查找模块的默认路径
    modulesDirectories : [
		'components',
		'node_modules',
	],
	 resolveLoader: {
        modulesDirectories: modulesDirectories
    },
	module: {
        loaders: [
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.tpl$/,
                loader: 'dot-tpl'
            },
            {
                test: /\.ejs$/,
                loader: 'ejs'
            },
            {
                test: /\.(png|gif|jpg|jpeg|svg)$/,
                loader: 'file?name=[path][name].[ext]'
            },
            {
                test: /\.(png|gif|jpg|jpeg|svg)(\?.*)$/,
                loader: 'url'
            },
            {
                test: /\.(ttf|eot|woff|aac|mp3|mp4)$/,
                loader: 'file?name=[path][name].[ext]'
            },
            {
                test: /\.(less|css)$/,
                loader:ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader') 
        	}    
        ]
    },
	plugins: [
		// 为package.json中常用模块重命名，可以在js直接使用，不需要require
		new webpack.ProvidePlugin({
		}),
        new webpack.optimize.OccurenceOrderPlugin(true),
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common/common',
            filename: 'common/common.js',
            minChunks: 2
        })
	]
};

module.exports = config;
