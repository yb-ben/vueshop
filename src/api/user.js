import request from '@/utils/request'
import {BASEURL} from './base'

export function login(data) {
  return request({
    url: BASEURL + '/api/v1/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: BASEURL + '/api/v1/admin/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
