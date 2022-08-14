import request from '@/utils/request'

const api_name = '/admin/hosp/hospital'

export default {

    //带条件带分页获取医院列表
    getPageList(page, limit, searchObj) {
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: 'get',
            params:searchObj
        })
    },

    updateStatus(id, status) {
        return request({
            url: `${api_name}/updateStatus/${id}/${status}`,
            method: 'get'
        })
    },

    //查看医院详情
    getHospById(id) {
        return request({
            url: `${api_name}/show/${id}`,
            method: 'get'
        })
    },

    //查看医院科室
    getDeptByHoscode(hoscode) {
        return request({
            url: `/admin/hosp/department/getDeptList/${hoscode}`,
            method: 'get'
        })
    }



}