import http from './fetch'
import userApi from './module/user'

export default Object.assign({
  // 登录
  login: data => http.post('/admin/teaching/user/login', data),
  // 登出
  logout: data => http.post('/admin/teaching/user/logout', data),

}, userApi)
