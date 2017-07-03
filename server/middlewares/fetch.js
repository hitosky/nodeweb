const url = require('url')
const request = require('request')
const config = require('../lib/config')
const {promisify, promisifyAll} = require('bluebird')

const requestPromise = promisify(promisifyAll(request))

export default function () {
  return async(ctx, next) => {
    ctx.fetch = function (opts = {}) {
      const headers = Object.assign({}, ctx.headers)
      const fetchUrl = opts.url

      // 处理请求头
      delete headers['content-length']
      delete headers['content-type']

      headers.host = url.parse(fetchUrl, true, true).host
      headers.account = ctx.session ? ctx.session.userName : ''
      headers.appName = config.appName

      // 添加公共参数
      const baseParams = {
        invokeAppName: config.appCode
      }

      opts.qs = Object.assign(opts.qs || {}, baseParams)

      opts.json = true
      opts.gzip = true
      opts.headers = headers

      const message = messageFactory(opts)

      // opts.proxy = 'http://127.0.0.1:8888'

      delete opts.url

      // 返回 Promise 对象
      return requestPromise(fetchUrl, opts).then((res) => {
        if (process.env.NODE_ENV === 'development') {
          ctx.log.info(message(res.body))
        }
        return res.body
      }).then(result => {
        if (result == null || result.code === 1) {
          ctx.log.warn(message(result))
        }
        return result
      }).catch((error) => {
        ctx.log.error(new Error(message(error)))
      })
    }

    await next()
  }
}

function messageFactory (opts) {
  const {method = 'GET', url, qs, body} = opts
  const request = `
    qs:${JSON.stringify(qs)}
    body:${JSON.stringify(body)}`

  return (result) => `
    ${method} ${url}
    REQUEST
      ${request}
    RESPONSE
      ${JSON.stringify(result)}`
}
