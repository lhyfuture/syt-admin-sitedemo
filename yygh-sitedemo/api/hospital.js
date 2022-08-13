import request from '@/utils/request'
const api_name = '/api/hosp/hospital'

export default {
    //带条件带分页获取医院列表
    getPageList(page, limit, searchObj) {
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: 'get',
            params: searchObj
        })
    },
    //根据医院名称获取医院列表
    findByHosname(hosname)  {
        return request({
            url: `${api_name}/findByHosname/${hosname}`,
            method: 'get'
        })
    },
    //医院预约挂号详情
    show(hoscode) {
        return request({
            url: `${api_name}/${hoscode}`,
            method: 'get'
        })
    },
    //获取科室列表
    findDepartment(hoscode) {
        return request({
            url: `${api_name}/department/${hoscode}`,
            method: 'get'
        })
    },

    getBookingScheduleRule(page, limit, hoscode, depcode) {
        return request({
            url: `${api_name}/auth/getBookingScheduleRule/${page}/${limit}/${hoscode}/${depcode}`,
            method: 'get'
        })
    },

    findScheduleList(hoscode, depcode, workDate) {
        return request({
            url: `${api_name}/auth/findScheduleList/${hoscode}/${depcode}/${workDate}`,
            method: 'get'
        })
    },
    getSchedule(id) {
        return request({
            url: `${api_name}/getSchedule/${id}`,
            method: 'get'
        })
    }



}
