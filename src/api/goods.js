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



export function attrs(params){
  return request({
    url: BASEURL + '/api/v1/admin/spu/attrs',
    method: 'get',
    params
  })
}

/**
 * 
 * @param {name} data 
 * @param {*} params
 * @response {data: id, code , msg } 
 */
export function addAttr(data,params){
  return request({
    url: BASEURL + '/api/v1/admin/spu/addAttr',
    method: 'post',
    data,
    params
  })
}

/**
 * 
 * @param {*} params 
 */
export function values(params){
  return request({
    url: BASEURL + '/api/v1/admin/spu/values',
    method: 'get',
    params
  })
}

export function addValue(data,params){
  return request({
    url: BASEURL + '/api/v1/admin/spu/addValue',
    method: 'post',
    data,
    params
  })
}

//上架
export function takeUp(data,params){
  return request({

      url:BASEURL+'/api/v1/admin/goods/takeUp',
      method:'post',
      data:{ids:data},
      params
  })
}

//下架
export function takeDown(data,params){
  return request({

      url:BASEURL+'/api/v1/admin/goods/takeDown',
      method:'post',
      data:{ids:data},
      params
  })
}


