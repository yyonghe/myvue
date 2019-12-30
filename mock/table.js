import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }],
  'approvalFlowList|25': [{
    id: '@integer(0, 500000000)',
    name: '@cword(6,20)',
    desc: '@sentence(20, 40)',
    flow: '@sentence(10, 20)',
    notifiers: '@sentence(3, 10)',
    author: '@word(5,8)'
  }]
})

export default [
  {
    url: '/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      items[0]
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/table/approval_flow_list',
    type: 'get',
    response: config => {
      const items = data.approvalFlowList
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/table/set_approval_flow',
    type: 'post',
    response: config => {
      return {
        code: 0,
        data: {
          msg: 'ok'
        }
      }
    }
  }
]
