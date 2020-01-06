import request from '@/utils/request'

export function getApprovalBusi(params) {
  return request({
    url: '/approvalbusi/get',
    method: 'get',
    params
  })
}

export function getApprovalBusiUsers(params) {
  return request({
    url: '/approvalbusi/users',
    method: 'get',
    params
  })
}

export function getApprovalBusiMyList(params) {
  return request({
    url: '/approvalbusi/mylist',
    method: 'get',
    params
  })
}

export function getApprovalBusiList(params) {
  return request({
    url: '/approvalbusi/list',
    method: 'get',
    params
  })
}

export function updateApprovalBusi(data) {
  return request({
    url: '/approvalbusi/update',
    method: 'post',
    data
  })
}

export function newApprovalBusi(data) {
  return request({
    url: '/approvalbusi/new',
    method: 'post',
    data
  })
}
