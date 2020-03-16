import request from '@/utils/request'
import {BASEURL} from './base'


export function addGoods(data,params){

  return request({
    
    url: BASEURL + '/api/v1/admin/goods/add',
    method: 'post',
    data,
    params    
  })
}


export function editGoods(data,params){

  return request({
    
    url: BASEURL + '/api/v1/admin/goods/edit',
    method: 'post',
    data,
    params    
  })
}



export function goodsList(params){

  return request({
    //url:'/vue-admin-template/goods/list',
    url: BASEURL + '/api/v1/admin/goods/list',
    method: 'get',
    params    
  })
}


export function detail(id,params){
  return request({
    url: BASEURL + '/api/v1/admin/goods/detail/'+id,
    method: 'get',
    params
  })
}






