
import Mock from 'mockjs'
import { sliceArray } from '../src/utils/index'
const defaultSettings = require('../src/settings.js')
const debug = require('debug')(defaultSettings.projectName + ':mock:approval-business')

const approvalBusiData = Mock.mock({
  'approvalBusiList|32': [{
    bid: '@integer(0, 500000000)',        // 业务ID
    // key: '@word(32,32)',                  // 业务对应的Key
    name: '@cword(8,10)',                 // 业务名称 
    desc: '@cword(40, 60)',               // 业务描述
    isOwner: '@integer(0, 1)',            // 是否是业务创建人
    isAdmin: '@integer(0, 1)',            // 是否是业务管理员
    hasAuthority: '@integer(0, 1)',       // 是否在这个业务下创建流程的权限
    author: '@word(5,8)',                 // 业务创建人
    'admins|5-10': ['@word(5,8)'],        // 业务管理员，可以对业务信息进行修改
    isOwner: '@integer(0, 1)',            // 是否是业务创建人
    isAdmin: '@integer(0, 1)',            // 是否是业务管理员
    hasAuthority: '@integer(0, 1)',       // 是否在这个业务下创建流程的权限
    'users|20-50': [                      // 业务用户，申请权限可以在改业务创建流程审批的用户
      {
        name: '@word(5,8)',
        authorityTime: '@integer(1578290565, 1578295565)',  // 权限申请时间
        overtime: '@integer(1578390565, 1578395565)'        // 权限过期时间
      }
    ]
  }],
})

export function getMyApprovalBusiIDList() {
  var myIDList = []
  for (let i = 0; i < approvalBusiData.approvalBusiList.length; i++) {
    var item = approvalBusiData.approvalBusiList[i]
    if(processItem(item)) {
      myIDList.push(item.bid)
    }
  }
  return myIDList
}

function processItem(item) {
  if(item.isOwner || item.isAdmin || item.hasAuthority) {
    item.hasAuthority = 1
    if(item.isOwner) {
      item.author = 'aaaaa'
      item.isAdmin = 1
    }
    return true
  }
  return false
}

export default [
  {
    url: '/approvalbusi/users',
    type: 'get',
    delay: 1000,
    response: config => {
      var users = {}
      for (let i = 0; i < approvalBusiData.approvalBusiList.length; i++) {
        if(config.query.bid == approvalBusiData.approvalBusiList[i].bid) {
          users = approvalBusiData.approvalBusiList[i].users
        }
      }
      var pageSize = config.query.pageSize
      var pageIndex = config.query.pageIndex
      var data = sliceArray(users, pageIndex, pageSize)
      return {
        code: 20000,
        data: {
          total: users.length,
          items: data
        }
      }
    }
  },

  {
    url: '/approvalbusi/get',
    type: 'get',
    // delay: 3000,
    response: config => {
      var data = {}
      for (let i = 0; i < approvalBusiData.approvalBusiList.length; i++) {
        if(config.query.bid == approvalBusiData.approvalBusiList[i].bid) {
          data = approvalBusiData.approvalBusiList[i]
        }
      }
      return {
        code: 20000,
        data: {
          item: data
        }
      }
    }
  },

  {
    url: '/approvalbusi/mylist',
    type: 'get',
    response: config => {
      var list = []
      for (let i = 0; i < approvalBusiData.approvalBusiList.length; i++) {
        var item = approvalBusiData.approvalBusiList[i]
        if(processItem(item)) {
          list.push(item)
        }
      }
      var pageSize = config.query.pageSize
      var pageIndex = config.query.pageIndex
      var data = sliceArray(list, pageIndex, pageSize)
      return {
        code: 20000,
        data: {
          total: list.length,
          items: data
        }
      }
    }
  },

  {
    url: '/approvalbusi/list',
    type: 'get',
    response: config => {
      var list = []
      for (let i = 0; i < approvalBusiData.approvalBusiList.length; i++) {
        var item = approvalBusiData.approvalBusiList[i]
        processItem(item)
        var newItem = {
          ...item
        }
        newItem.user = []
        list.push(newItem)
      }
      //
      var pageSize = config.query.pageSize
      var pageIndex = config.query.pageIndex
      var data = sliceArray(list, pageIndex, pageSize)
      return {
        code: 20000,
        data: {
          total: list.length,
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
      return {
        code: 20000,
        data: {
          "msg": 'ok'
        }
      }
    }
  }
]

