import request from '@/utils/request'

export function getCateList(params) {
  return request({
    url: '/vue-admin-template/cate/list',
   // url:'/api/v1/admin/category/tree',
    method: 'get',
    params
  })
}
