import request from '@/utils/request'

// 获取server列表
export function getRabbitmqServerList(params) {
  return request({
    url: '/rabbitmq/management/',
    method: 'get',
    params
  })
}

// 创建server
export function createRabbitmqServer(params) {
  return request({
    url: '/rabbitmq/management/',
    method: 'post',
    data: params
  })
}

// 删除服务器
export function deleteRabbitmqServer(id) {
  return request({
    url: '/rabbitmq/management/' + id + '/',
    method: 'delete'
  })
}

// 更新服务器
export function updateRabbitmqServer(params) {
  return request({
    url: '/rabbitmq/management/' + params.id + '/',
    method: 'patch',
    data: params
  })
}