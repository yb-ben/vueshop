import request from '@/utils/request'



export function addGoods(data,params){

  return request({
    
    url:'/vue-admin-template/goods/add',
    method: 'post',
    data,
    params    
  })
}

