import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function getApprovalFlowList(params) {
  return request({
    url: '/table/approval_flow_list',
    method: 'get',
    params
  })
}

export function setApprovalFlow(params) {
  return request({
    url: '/table/set_approval_flow',
    method: 'post',
    params
  })
}
