const path = require('path')
const glob = require('glob')
const Router = require('koa-router')
const appConfig = require('./config')

const router = new Router()
const controllersDir = path.join(__dirname, '../controllers')

glob
  .sync('**/*.js', {
    cwd: controllersDir
  })
  .forEach(ctrPath => {
    ctrPath = ctrPath.replace(/([/\\]?index)?\.js$/, '')

    const controller = require(path.join(controllersDir, ctrPath))

    router.all(path.join(appConfig.baseURI, ctrPath), controller)
    
    // 设置根路由
    if (ctrPath === 'home') {
      router.all(appConfig.baseURI + '/', controller)
    }
  })



module.exports = router
