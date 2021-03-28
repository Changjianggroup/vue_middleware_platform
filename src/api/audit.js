import request from '@/utils/request'

export function getAuditRecordList(queryParams) {
    return request({
        url: '/api/v1/audit/records/',
        method: 'get',
        params: queryParams
    })
}
