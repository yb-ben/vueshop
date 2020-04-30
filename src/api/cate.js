import request from '@/utils/request'
import {BASEURL} from './base'

export function getCateList(params) {
  return request({
    //url: '/vue-admin-template/cate/list',
    url: BASEURL +'/api/v1/admin/category/tree',
    method: 'get',
    params
  })
}

export function addCate(data,params){

  return request({

    //url:'/vue-admin-template/cate/add',
    url: BASEURL + '/api/v1/admin/category/add',
    method: 'post',
    data,
    params
  })
}


export function editCate(data,id){

  return request({

    //url:'/vue-admin-template/cate/add',
    url: BASEURL + '/api/v1/admin/category/edit/'+id,
    method: 'post',
    data,
  })
}

export function detail(id) {
  return request({
    url:BASEURL+'/api/v1/admin/category/detail/'+id,
    method:'get',
  })
}

export function getAttrs(id,params){

  return request({
   // url:'/vue-admin-template/cate/attrs',
    url:  BASEURL + '/api/v1/admin/category/attrs/'+id,
   method:'get',
    params
  });
}
