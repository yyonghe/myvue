
import Mock from 'mockjs'
const defaultSettings = require('../src/settings.js')
const debug = require('debug')(defaultSettings.projectName + ':mock:approval-business')


const approvalBusi = {
  id: '@integer(0, 500000000)',         // 业务ID
  key: '@word(32,32)',                  // 业务对应的Key
  name: '@cword(8,10)',                 // 业务名称 
  desc: '@cword(40, 60)',               // 业务描述
  isOwner: '@integer(0, 1)',            // 是否是业务创建人
  isAdmin: '@integer(0, 1)',            // 是否是业务管理员
  hasAuthority: '@integer(0, 1)',       // 是否在这个业务下创建流程的权限
  author: '@word(5,8)',                 // 业务创建人
  'admins|5-10': ['@word(5,8)'],        // 业务管理员，可以对业务信息进行修改
}

const approvalBusiList = Mock.mock({
  'myApprovalBusi|4': [{
    ...approvalBusi,
    isOwner: '@integer(0, 1)',            // 是否是业务创建人
    isAdmin: 1,                           // 是否是业务管理员
    hasAuthority: 1,                      // 是否在这个业务下创建流程的权限
  }],
  'allApprovalBusi|30': [{
    ...approvalBusi,
    isOwner: 0,                           // 是否是业务创建人
    isAdmin: 0,                           // 是否是业务管理员
    hasAuthority: '@integer(0, 1)',       // 是否在这个业务下创建流程的权限
  }],
  'users|20-50': [                      // 业务用户，申请权限可以在改业务创建流程审批的用户
    {
      name: '@word(5,8)',
      authorityTime: '@integer(1578290565, 1578295565)',  // 权限申请时间
      overtime: '@integer(1578390565, 1578395565)'        // 权限过期时间
    }
  ]
})

export function approvalBusiId(index) {
  for (var i = 0; i < approvalBusiList.myApprovalBusi.length; i++) {
    if (index === i) {
      return approvalBusiList.myApprovalBusi[i].id
    }
  }
}

export default [
  {
    url: '/approvalbusi/users',
    type: 'get',
    // delay: 3000,
    response: config => {
      var data = approvalBusiList.users
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
    url: '/approvalbusi/get',
    type: 'get',
    // delay: 3000,
    response: config => {
      var data = approvalBusiList.myApprovalBusi
      return {
        code: 20000,
        data: {
          item: data[0]
        }
      }
    }
  },

  {
    url: '/approvalbusi/mylist',
    type: 'get',
    response: config => {
      var data = approvalBusiList.myApprovalBusi
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
    url: '/approvalbusi/list',
    type: 'get',
    response: config => {
      var data = JSON.parse(JSON.stringify(approvalBusiList.myApprovalBusi))
      var allApprovalBusi = approvalBusiList.allApprovalBusi
      debug('allApprovalBusi', allApprovalBusi.length)
      for (let i = 0; i < allApprovalBusi.length; i++) {
        data.push(allApprovalBusi[i])
      }
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
      var data = approvalBusiList.myApprovalBusi
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

