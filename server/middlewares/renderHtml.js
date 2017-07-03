const { ip, port, devIp, devPort } = require("../lib/config").server
const env = process.env.NODE_ENV || 'development'
const baseURI = `http://` + (env == "development"
  ? `${devIp}:${devPort}`
  : `${ip}:${port}`
)

export default () => async (ctx, next) => {
  ctx.renderHtml= (htmlPath,data) => {
    ctx.render(htmlPath, {...data,baseURI})
  }
  return next()
}
