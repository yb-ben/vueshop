import request from '@/utils/request'



export function uploadImage(data,params){

  return request({
    
    url:'http://shop.com/api/v1/admin/upload/uploadImage',
    method: 'post',
    data,
    params    
  })
}

export const uploadImageUrl = 'http://shop.com/api/v1/admin/upload/uploadImage';