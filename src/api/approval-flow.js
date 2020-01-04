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

export function updateApprovalFlow(data) {
  return request({
    url: '/approvalflow/update',
    method: 'post',
    data
  })
}

export function newApprovalFlow(data) {
  return request({
    url: '/approvalflow/new',
    method: 'post',
    data
  })
}
