const vm = require("vm")
const Promise = require("bluebird")
const babel = require("babel-core")
const yaml = require("js-yaml")
const bodyParser = require("body-parser")
const webpack = require("webpack")
const WebpackDevServer = require("webpack-dev-server")
const ip = require("dev-ip")
const path = require("path")
const fs = require("fs-extra")

const transform = Promise.promisify(babel.transformFile)
const directory = require("../directory")
const webpackConfig = require(path.join(
  directory.configPath,
  `webpack2.config.js`
))

let entry = webpackConfig.entry
const appConfig = yaml.safeLoad(
  fs.readFileSync(path.join(directory.configPath, "app.yaml"))
)

const devIp = appConfig.server.devIp
const devPort = appConfig.server.devPort
const baseUrl = `http://${devIp}:${devPort}`
const devClient = [`webpack-dev-server/client?${baseUrl}`]
const publicPath = (webpackConfig.output.publicPath = `${baseUrl}/build`)
const compiler = webpack(webpackConfig)

Object.keys(entry).forEach(entryName => {
  entry[entryName] = devClient.concat(
    entry[entryName],
    "webpack/hot/dev-server"
  )
})

const server = new WebpackDevServer(compiler, {
  contentBase: directory.appPath,
  // 静态模式：不输出webpack信息
  quiet: true,
  // 仅输出waring和error信息
  noInfo: true,
  // 是否采用gzip压缩
  compress: true,
  inline: true,
  watchOptions: {
    // 文件改变后过300ms更新
    aggregateTimeout: 300,
    poll: 500
  },

  // 引入资源路径
  publicPath,

  // 代理，重定向request
  proxy: {},
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
  }
})

compiler.plugin("compile", () => {
  console.log("webpack building...")
})
compiler.plugin("done", stats => {
  const time = (stats.endTime - stats.startTime) / 1000

  if (stats.hasErrors()) {
    console.log("webpack build error")

    return console.log(
      stats.toString({
        colors: true,
        timings: false,
        hash: false,
        version: false,
        assets: false,
        reasons: false,
        chunks: false,
        children: false,
        chunkModules: false,
        modules: false
      })
    )
  }
  console.log(`webpack build success in ${time.toFixed(2)} s`)
})

const app = server.app

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

app.all("/mock/*", (req, res) => {
  const mockPath = path.join(directory.projectPath, `${req.path}.js`)
  transform(mockPath)
    .then(result => {
      const sandbox = {
        module: {},
        exports: {},
        global: global,
        require: require
      }

      Object.assign(sandbox, global)

      const value = vm.runInNewContext(result.code, sandbox)

      if (typeof value === "function") {
        return value(req)
      }

      return value
    })
    .then(ret => {
      if (ret.$$header) {
        Object.keys(ret.$$header).forEach(key => {
          res.setHeader(key, ret.$$header[key])
        })
      }

      const delay = ret.$$delay || 0

      delete ret.$$header
      delete ret.$$delay

      return Promise.delay(delay, ret)
    })
    .then(ret => {
      if (req.query.callback) {
        res.jsonp(ret)
      } else {
        res.send(ret)
      }
    })
    .catch(err => {
      res.status(500).send({
        code: 1,
        error: (err || {}).stack || err
      })
    })
})

server.listen(devPort, () => {
  console.log(`webpack-dev-server listen at ${devPort}`)
})
