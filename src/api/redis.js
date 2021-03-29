import request from '@/utils/request'

// 获取redis server列表
export function getServerList(params) {
  return request({
    url: '/api/v1/redis/',
    method: 'get',
    params
  })
}
// 创建redis server
export function createServer(params) {
  return request({
    url: '/api/v1/redis/',
    method: 'post',
    data: params
  })
}

// 删除服务器
export function deleteServer(id) {
  return request({
    url: '/api/v1/redis/' + id + '/',
    method: 'delete'
  })
}

// 更新服务器
export function updateServer(params) {
  return request({
    url: '/api/v1/redis/update_redis/',
    method: 'post',
    data: params
  })
}
// export function showALLKey(params) {
//   return request({
//     url: '/redis/ops/get_all_key/',
//     method: 'post',
//     data: { id: params }
//   })
// }

export function showDBSize(params) {
  return request({
    url: '/api/v1/redis/dbszie/',
    method: 'post',
    data: { id: params }
  })
}
export function getKey(params) {
  return request({
    url: '/api/v1/redis/get_key/',
    method: 'post',
    data: { id: params.id, key: params.key }
  })
}

export function getKeys(params) {
  return request({
    url: '/api/v1/redis/get_keys/',
    method: 'post',
    data: { id: params.id, pattern: params.pattern }
  })
}
export function getKeyTTL(params) {
  return request({
    url: '/api/v1/redis/ttl/',
    method: 'post',
    data: { id: params.id, key: params.key }
  })
}
export function delKey(params) {
  return request({
    url: '/api/v1/redis/del_key/',
    method: 'post',
    data: { id: params.id, key: params.key }
  })
}

export function delPatternKeys(params) {
  return request({
    url: '/api/v1/redis/del_pattern_keys/',
    method: 'post',
    data: { id: params.id, pattern: params.pattern }
  })
}
export function createKey(params) {
  return request({
    url: '/api/v1/redis/set_key/',
    method: 'post',
    data: { id: params.id, key: params.key, value: params.value }
  })
}
export function clusterNode(id) {
  return request({
    url: '/api/v1/redis/cluster_node/',
    method: 'post',
    data: { id: id }
  })
}
export function clusterInfo(id) {
  return request({
    url: '/api/v1/redis/cluster_info/',
    method: 'post',
    data: { id: id }
  })
}
export function findCluster(params) {
  return request({
    url: '/api/v1/redis/',
    method: 'get',
    params
  })
}