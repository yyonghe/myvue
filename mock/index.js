import Mock from 'mockjs'
import { param2Obj } from '../src/utils'

import user from './user'
import table from './table'
import approvalflow from './approval-flow'
import approvalbusi from './approval-business'
const defaultSettings = require('../src/settings.js')
const debug = require('debug')(defaultSettings.projectName + ':mock:index')

const mocks = [
  ...user,
  ...table,
  ...approvalflow,
  ...approvalbusi
]

// for front mock 纯前端的mock方式，在入口处加载这个函数
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
export function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function(options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

// for mock server
const mockItemWrapper = (url, type, delay, respond) => {
  return {
    url: new RegExp(`/mock${url}`),
    type: type || 'get',
    response(req, res) {
      debug('delay', url, delay)  
      var rspFunc = () => {
        res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
      }
      
      if (delay != null) {
        setTimeout(rspFunc, delay)
      } else {
        rspFunc()
      }
    }
  }
}

export default mocks.map(route => {
  return mockItemWrapper(route.url, route.type, route.delay, route.response)
})
