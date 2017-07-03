const Koa = require("koa")
const path = require("path")
const nunjucks = require("koa-nunjucks-2")
const bodyParser = require("koa-bodyparser")
const session = require("koa-session-redis")
const staticServer = require("koa-static")
const Promise = require("bluebird")
const convert = require("koa-convert")
const bs = require("browser-sync").create()

Promise.config({
  warnings: false,
  longStackTraces: true
})

global.Promise = Promise

const directory = require("../directory")
const app = new Koa()
const isDev = app.env === "development"

const router = require("./lib/router")
const config = require("./lib/config")
const { devIp, port } = config.server

const renderHtml = require('./middlewares/renderHtml')
const fetch = require('./middlewares/fetch')

app.use(staticServer(directory.projectPath))
app.use(bodyParser())

// ctx默认渲染views路径下的html
app.use(
  nunjucks({
    ext: "html",
    path: directory.appPath,
    nunjucksConfig: {
      noCache: true,
      autoescape: true
    }
  })
)
app.use(renderHtml())
app.use(fetch())
// 路由配置
app.use(router.routes(), router.allowedMethods())

// 自动路由

if (require.main === module) {
  if (isDev) {
    bs.watch(directory.appPath).on("change", () => {
      bs.reload()
    })
    bs.init(
      {
        open: false,
        proxy: `http://${devIp}:${port}`,
        reloadDelay: 1000
      },
      () => {
        app.listen(port, () => {
          console.log(`server started at localhost:${port}`)
        })
      }
    )
  } else {
    app.listen(port, () => {
      console.log(`server started at localhost:${port}`)
    })
  }
} else {
  module.exports = app
}
