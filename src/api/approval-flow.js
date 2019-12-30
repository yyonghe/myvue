import request from '@/utils/request'

export function getApprovalFlow(params) {
  return request({
    url: '/approvalflow/get',
    method: 'get',
    params
  })
}

export function getApprovalFlowList(params) {
  return request({
    url: '/approvalflow/list',
    method: 'get',
    params
  })
}
