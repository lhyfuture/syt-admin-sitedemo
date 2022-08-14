import request from '@/utils/request'

const api_name = '/admin/hosp/hospitalSet'

export default {
    pageQuery(page,limit,searchObj){
        return request({
            url: `${api_name}/pageQuery/${page}/${limit}`,
            method: 'post',
            data: searchObj
        })

    },

    removeById(id){
        return request({
            url: `${api_name}/${id}`,
            method: 'delete'
        })
    },

    save(hospitalSet){
        return request({
            url: `${api_name}/save`,
            method: 'post',
            data: hospitalSet//用json数据传输，后端在请求体中接受

        })
    },

    //根据id查询医院设置
    getById(id){
        return request({
            url: `${api_name}/getById/${id}`,
            method: 'get'
          })
    },

    //修改医院设置
    update(hospitalSet){
        return request({
            url: `${api_name}/update`,
            method: 'post',
            data:hospitalSet //用json
          })
    },

    //批量删除医院设置
    batchRemove(idList) {
        return request({
            url: `${api_name}/batchRemove`,
            method: 'delete',
            data: idList
        })
    },

    //锁定和取消锁定
    lockHospSet(id,status) {
         return request ({
              url: `/admin/hosp/hospitalSet/lockHospitalSet/${id}/${status}`,
               method: 'put'
         })
     },


     



    




}