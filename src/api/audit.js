import request from '@/utils/request'

export function getLoginList(queryParams) {
    return request({
        url: '/audit/login/',
        method: 'get',
        params: queryParams
    })
}


export function getDBCRUDList(queryParams) {
    return request({
        url: '/audit/crud/',
        method: 'get',
        params: queryParams
    })
}

export function getRequestList(queryParams) {
    return request({
        url: '/audit/request/',
        method: 'get',
        params: queryParams
    })
}
