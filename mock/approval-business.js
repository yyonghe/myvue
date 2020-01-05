
import Mock from 'mockjs'
const defaultSettings = require('../src/settings.js')
const debug = require('debug')(defaultSettings.projectName + ':mock:approval-business')

const approvalFlowList = Mock.mock({
  'items|4': [{
    id: '@integer(0, 500000000)',         // 业务ID
    key: '@word(32,32)',                  // 业务对应的Key
    name: '@cword(8,10)',                 // 业务名称 
    desc: '@cword(40, 60)',               // 业务描述
    author: '@word(5,8)',                 // 业务创建人
    'admins|5-10': ['@word(5,8)'],        // 业务管理员，可以对流程审批环境进行修改
  }]
})

export default [
  {
    url: '/approvalbusi/get',
    type: 'get',
    // delay: 3000,
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
    url: '/approvalbusi/list',
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
    url: '/approvalbusi/update',
    type: 'post',
    delay: 2100,
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
    url: '/approvalbusi/new',
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

