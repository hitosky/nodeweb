const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const path = require('path')
const directory = require('../directory')
const webpackConfig = require(path.join(directory.configPath,`webpack2.config.js`))
console.log(webpackConfig)
const compiler = webpack(webpackConfig)
const server = new WebpackDevServer(compiler)

server.listen(9999,()=>{
  console.log('webpack-dev-server listen at 9999')
})