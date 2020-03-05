import request from '@/utils/request'

export function getCateList(params) {
  return request({
    url: '/vue-admin-template/cate/list',
   // url:'http://shop.com/api/v1/admin/category/tree',
    method: 'get',
    params
  })
}

export function addCate(data,params){

  return request({
    
    url:'/vue-admin-template/cate/add',
    //url: 'http://shop.com/api/v1/admin/category/add',
    method: 'post',
    data,
    params    
  })
}