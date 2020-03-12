import request from '@/utils/request'



export function addGoods(data,params){

  return request({
    
    url:'http://shop.yuna.group/api/v1/admin/goods/add',
    method: 'post',
    data,
    params    
  })
}



export function goodsList(params){

  return request({
    //url:'/vue-admin-template/goods/list',
    url:'http://shop.yuna.group/api/v1/admin/goods/list',
    method: 'get',
    params    
  })
}






