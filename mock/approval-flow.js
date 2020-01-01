
import Mock from 'mockjs'
const defaultSettings = require('../src/settings.js')
const debug = require('debug')(defaultSettings.projectName + ':mock:approval-flow')

const approvalFlowList = Mock.mock({
  'items|30': [{
    id: '@integer(0, 500000000)',
    key: '@word(32,32)',
    name: '@cword(8,10)',
    desc: '@cword(40, 60)',
    author: '@word(5,8)',
    'admins|5-10': ['@word(5,8)'],
    'mailto|5-10': ['@word(5,8)'],
    'approvals|2-4': [
      {
        'operators|1-5': ['@word(5,8)'],
        'mode|1': ['&', '|'],
        notify: {
          type: '0'
        }
      }
    ]
  }]
})

export default [
  {
    url: '/approvalflow/get',
    type: 'get',
    delay: 3000,
    response: config => {
      var data = approvalFlowList.items
      return {
        code: 20000,
        data: {
          item: data[0]
        }
      }
    }
  },

  {
    url: '/approvalflow/list',
    type: 'get',
    response: config => {
      var data = approvalFlowList.items
      return {
        code: 20000,
        data: {
          total: data.length,
          items: data
        }
      }
    }
  },

  {
    url: '/approvalflow/update',
    type: 'post',
    delay: 2000,
    response: config => {
      debug('/approvalflow/update config: ', config.body)
      return {
        code: 20000,
        data: {
          "msg": 'ok'
        }
      }
    }
  },
  
  {
    url: '/approvalflow/new',
    type: 'post',
    response: config => {
      var data = approvalFlowList.items
      return {
        code: 20000,
        data: {
          total: data.length,
          items: data
        }
      }
    }
  }
]

