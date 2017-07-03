const url = require('url')
const path = require('path')

const envMap = require('./envMap')
const apiMap = require('./apiMap')

const env = process.env.NODE_ENV || 'development'

module.exports = function (key, pathname = '') {
  const ret =
    apiMap[key] || apiMap[key.replace(/^\//, '')] || apiMap['/' + key] || key

  const parsed = url.parse(envMap[env], true, true)

  if (env === 'development') {
    parsed.pathname = path.join(parsed.pathname, key)
    return parsed.format()
  }

  if (typeof ret === 'object') {
    const parsed = url.parse(ret[env], true, true)
    parsed.pathname = path.join(parsed.pathname, pathname)
    return parsed.format()
  }
  parsed.pathname = path.join(parsed.pathname, ret, pathname)

  return parsed.format()
}

exports.apiMap = apiMap
