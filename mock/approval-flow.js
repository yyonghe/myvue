
import Mock from 'mockjs'
import { approvalBusiId } from './approval-business'

const defaultSettings = require('../src/settings.js')
const debug = require('debug')(defaultSettings.projectName + ':mock:approval-flow')

const approvalFlowList = Mock.mock({
  'items|30': [{
    id: '@integer(0, 500000000)',         // 流程ID
    key: '@word(32,32)',                  // 流程对应的Key
    bid: approvalBusiId(Mock.Random.integer(0, 4)),                // 流程对应的业务ID
    name: '@cword(8,10)',                 // 流程名称 
    desc: '@cword(40, 60)',               // 流程描述
    author: '@word(5,8)',                 // 流程创建人
    'admins|5-10': ['@word(5,8)'],        // 流程管理员，可以对流程审批环节进行修改
    'mailto|5-10': ['@word(5,8)'],        // 流程审批结果知会人员
    fnotify: {                            // 流程审批驳回通知方式配置
      type: '@integer(0, 2)'              // 审批驳回通知方式 0-不通知；1-http回调；2-trpc回调
    },
    'approvals|2-4': [                    // 流程审批环节配置
      {
        'operators|1-5': ['@word(5,8)'],  // 流程审批环节审批人员
        mode: '@integer(0, 2)',           // 流程审批环节通过方式 0-固定leader审批，1-所有审批人员都审批通过；2-任何一个审批人员通过即可
        notify: {                         // 流程审批环节审批通过通知方式配置
          type: '@integer(0, 2)'          // 通知方式 0-不通知；1-http回调；2-trpc回调
        }
      }
    ]
  }]
})

export default [
  {
    url: '/approvalflow/get',
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
      debug('/approvalflow/update config: ', JSON.stringify(config.body))
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

