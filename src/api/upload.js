import request from '@/utils/request'

import {BASEURL} from './base'

export function uploadImage(data,params){

  return request({
    
    url: BASEURL + '/api/v1/admin/upload/uploadImage',
    method: 'post',
    data,
    params    
  })
}

export const uploadImageUrl =  BASEURL + '/api/v1/admin/upload/uploadImage';


export function imageList(params){
  return request({
    url:BASEURL + '/api/v1/admin/upload/imageList',
    method:'get',
    params
  })
}