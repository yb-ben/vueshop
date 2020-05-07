import request from '@/utils/request'

import {BASEURL} from './base'

export const UPLOADURL = BASEURL+'/api/v1/admin/upload/uploadImage';


export function uploadImage(data,params){

  return request({

    url: UPLOADURL,
    method: 'post',
    data,
    params
  })
}
export function imageList(params){
  return request({
    url:BASEURL + '/api/v1/admin/upload/imageList',
    method:'get',
    params
  })
}
