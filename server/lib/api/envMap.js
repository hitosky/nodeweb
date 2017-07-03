const config = require('../config')

const devPort = config.server.devPort

// 接口基础路径表
module.exports = {
  development: `http://localhost:${devPort}/mock/`,
  test:'',
  production:''
}
