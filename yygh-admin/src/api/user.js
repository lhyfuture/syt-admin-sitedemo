import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/hosp/hospitalSet/login',
    method: 'post',
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/hosp/hospitalSet/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
