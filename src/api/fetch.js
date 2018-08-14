import axios from 'axios'
import qs from 'qs'
import { Message, Loading } from 'element-ui'
import router from '@/router'

const service = axios.create({
  // baseURL: 'http://yapi.tzdtz.com/mock/19', // api的base_url
  timeout: 15000, // 请求超时时间
  responseType: 'json',
  withCredentials: true, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/json;charset=utf-8', // application/x-www-form-urlencoded;charset=utf-8
  },
})

let loadingRequestCount = 0
let loading

function showLoading() {
  if (loadingRequestCount === 0) {
    loading = Loading.service({
      lock: true,
      text: '加载中……',
    })
  }
  loadingRequestCount += 1
}

function hideLoading() {
  if (loadingRequestCount <= 0) return
  loadingRequestCount -= 1
  if (loadingRequestCount === 0) {
    loading.close()
  }
}

// 添加请求拦截器
service.interceptors.request.use((request) => {
  // 若有做鉴权token，需要请求头自动加上token
  if (localStorage.getItem('token')) {
    request.headers.Authorization = localStorage.getItem('token')
  }
  // 显示loading
  if (!request.hideLoading) {
    showLoading()
  }

  if (request.data && (request.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') !== -1)) {
    request.data = qs.stringify(request.data)
  }

  return request
}, (error) => {
  Message({
    showClose: true,
    message: error,
    type: 'error',
  })
  return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use((res) => {
  // 隐藏loading
  if (!res.config.hideLoading) {
    hideLoading()
  }
  const result = res.data
  const { status } = result
  if (status !== 0) {
    // 显示接口报错信息
    let msg = result.msg || '服务器出错了～'

    if (status === 'B0001' && result.msg === 'null') {
      msg = '用户已退出～'
    }

    Message({
      showClose: true,
      message: msg,
      type: 'error',
    })

    // token失效返回到登录页面中
    if (status === 2 || status == 401) {
      localStorage.removeItem('token')
      router.push({
        path: '/login',
      })
    }

    return Promise.reject(msg)
  }
  return result.data
}, (error) => {
  hideLoading()
  const { status } = error.response
  // 下面是接口回调的satus ,因为我做了一些错误页面,所以都会指向对应的报错页面
  switch (status) {
    case 2:
    case 401:
      localStorage.removeItem('token')
      router.push({
        path: '/login',
      })
      break
    case 404:
      Message({
        showClose: true,
        message: '请求接口不存在',
        type: 'error',
      })
      break
    case 502:
      Message({
        showClose: true,
        message: '服务器出错了',
        type: 'error',
      })
      break
    default:
      break
  }
  // 返回 response 里的错误信息
  return Promise.reject(error)
})

const http = {
  get: (path, data, config) => service.get(path, {
    params: data,
    ...config,
  }),

  post: (path, data, config) => service.post(path, data, config),

  delete: (path, data, config) => service.delete(path, {
    params: data,
    ...config,
  }),
}

export default http
