import request from '@/utils/request'

// 获取server列表
export function getServerList(params) {
  return request({
    url: '/redis/management/',
    method: 'get',
    params
  })
}

// 创建server
export function createServer(params) {
  return request({
    url: '/redis/management/',
    method: 'post',
    data: params
  })
}

// 删除服务器
export function deleteServer(id) {
  return request({
    url: '/redis/management/' + id + '/',
    method: 'delete'
  })
}

// 更新服务器
export function updateServer(params) {
  return request({
    url: '/redis/management/' + params.id + '/',
    method: 'patch',
    data: params
  })
}
export function showALLKey(params) {
  return request({
    url: '/redis/ops/get_all_key/',
    method: 'post',
    data: { id: params }
  })
}

export function showDBSize(params) {
  return request({
    url: '/redis/ops/dbsize/',
    method: 'post',
    data: { id: params }
  })
}
export function getKey(params) {
  return request({
    url: '/redis/ops/get_key/',
    method: 'post',
    data: { id: params.id, key: params.key }
  })
}
export function getKeyTTL(params) {
  return request({
    url: '/redis/ops/get_ttl/',
    method: 'post',
    data: { id: params.id, key: params.key }
  })
}
export function delKey(params) {
  return request({
    url: '/redis/ops/del_key/',
    method: 'post',
    data: { id: params.id, key: params.key }
  })
}
export function createKey(params) {
  return request({
    url: '/redis/ops/set_key/',
    method: 'post',
    data: { id: params.id, key: params.key, value: params.value }
  })
}
export function clusterNode(id) {
  return request({
    url: '/redis/ops/cluster_node/',
    method: 'post',
    data: { id: id }
  })
}
export function clusterInfo(id) {
  return request({
    url: '/redis/ops/cluster_info/',
    method: 'post',
    data: { id: id }
  })
}
