// import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import { USER_INFO } from '@/store/mutations'
import path from '@/router/path'


router.beforeEach((to, from, next) => {
  // if (localStorage.getItem('token')) {
  //   if (to.path === path.site.login) {
  //     next({ path: path.index })
  //   } else if (!store.state.user.userInfo) { // 判断当前用户是否已拉取完用户信息
  //     store.dispatch(USER_INFO, localStorage.getItem('userId')).then(() => { // 拉取用户信息
  //       next()
  //     }).catch(() => {
  //       // 登出
  //       store.dispatch('USER_CLEAR').then(() => {
  //         next({ path: path.site.login })
  //       }).catch(() => {
  //         next({ path: path.site.login })
  //       })
  //     })
  //   } else {
  //     next()
  //   }
  // } else if (to.meta.requireLogin === false) {
  //   next()
  // } else {
  //   next(path.site.login) // 否则重定向到登录页
  // }
  next()
  document.title = to.meta.title ? `${to.meta.title} - 教务后台` : `${to.matched[0].meta.title || '首页'} - 教务后台`
})
