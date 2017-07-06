module.exports = {
  fetchOriginData: (url, opts) => {
    let realOpts = Object.assign({}, {
      method: 'GET',
      cache: 'default',
      credentials:'include'
    }, opts)
    realOpts.headers = new Headers(opts.headers || {})

    let request = new Request(url || location.href, realOpts)
    return new Promise((resolve, reject) => {
      fetch(request).then(response => {
        resolve(response)
      })

    })
  },
  getJSON (
    url,
    params,
    {
      showMessage = true // 是否自动显示错误信息
    } = {}
  ) {
    const paramStr = this.serialize(this.parseData(params))
    const fetchUrl = !paramStr
      ? url
      : url + (url.includes('?') ? '&' : '?') + paramStr

    return new Promise((resolve, reject) => {
      fetch(window.__baseURI__ + fetchUrl, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'x-requested-with': 'XMLHttpRequest'
        }
      })
        .then(response => {
          try {
            return response.json()
          } catch (e) {
            /* eslint-disable no-console */
            console.error(e)
            /* eslint-enable no-console */
          }
        })
        .then(result => {
          if (result.code === 0) {
            resolve(result.data)
          } else {
            throw result.error || '请求异常'
          }
        })
        .catch(error => {
          if (showMessage) {
            message.error(error, 2)
          }
          reject(error)
        })
    })
  },

 postData (
    url,
    params,
    {
      showMessage = true, // 是否自动显示错误信息
      filterEmpty = true // 是否过滤空值
    } = {}
  ) {
    return new Promise((resolve, reject) => {
      fetch(window.__baseURI__ + url, {
        method: 'POST',
        headers: {
          'x-requested-with': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(this.parseData(params, filterEmpty))
      })
        .then(response => {
          try {
            return response.json()
          } catch (e) {
            /* eslint-disable no-console */
            console.error(e)
            /* eslint-enable no-console */
          }
        })
        .then(result => {
          if (result.code === 0) {
            resolve(result.data)
          } else {
            throw result.error || '请求异常'
          }
        })
        .catch(error => {
          if (showMessage) {
            message.error(error, 2)
          }
          reject(error)
        })
    })
  },
  saveData (url, params, options = {}) {
    // 考虑修改数据的时候，清空某一项，需要传递到服务端
    options.filterEmpty = false
    return this.postData(url, params, options)
  },

  serialize (data) {
    return Object.keys(data).map(key => `${key}=${data[key]}`).join('&')
  },

  parseData: function (data = {}, filterEmpty = true) {
    const result = {}
    Object.keys(data).forEach(key => {
      const value = this.parseValue(data[key])

      if (!filterEmpty || value !== '') {
        result[key] = value
      }
    })

    return result
  },

  parseValue (value) {
    let result = value

    if (typeof value === 'string') {
      result = value.trim()
    }

    if (value instanceof moment) {
      result = value.format('YYYY-MM-DD')
    }

    if (Array.isArray(value)) {
      result = JSON.stringify(value)
    }

    if (value === null || value === undefined) {
      result = ''
    }

    return result
  },

  // 下载
  download (url, params = {}) {
    const downloadurl =
      window.__baseURI__ +
      url +
      (url.includes('?') ? '&' : '?') +
      this.serialize(params)

    const iframe = document.createElement('iframe')

    iframe.src = downloadurl
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
  }
}