import request from '@/utils/request'

// 获取url权限组名单
export function getPermissionGroupList(params) {
    return request({
        url: '/url_premission/group/',
        method: 'get',
        params: params
    })
}

// 创建用户组
export function createPermissionGroup(data) {
    return request({
        url: '/url_premission/group/',
        method: 'post',
        data: data
    })
}

// 删除权限组
export function deletePermissionGroup(id) {
    return request({
        url: '/url_premission/group/' + id + '/',
        method: 'delete',
    })
}
// 更新权限组
export function updatePermissionGroup(params) {
    return request({
        url: '/url_premission/group/' + params.id + '/',
        method: 'patch',
        data: params
    })
}


// 获取url权限列表
export function getUrlPermission(params) {
    return request({
        url: '/url_premission/url/',
        method: 'get',
        params: params
    })
}

// 更新对应权限组可以管理的url权限
export function updateGroupPerm(data) {
    return request({
        url: '/url_premission/group/update_urls/',
        method: 'post',
        data: data
    })
}
// 更新用户所属url权限组
export function updateUserGroup(data) {
    return request({
        url: '/url_premission/group/update_users/',
        method: 'post',
        data: data
    })
}

// 删除url权限组用户
export function deleteGroupUserMember(data) {
    return request({
        url: '/url_premission/group/delete_user/',
        method: 'post',
        data: data
    })
}