import Vue from 'vue'
import Router from 'vue-router'
import path from '@/router/path'

// 不需要懒加载的页面
import Login from '@/pages/site/login'
import LiveRoute from './routes/live'

Vue.use(Router)

export const routes = [].concat(LiveRoute, [
  {
    path: path.index,
    redirect: path.live.index,
  },
  {
    path: path.site.login,
    component: Login,
    meta: {
      title: '登录',
      requireLogin: false,
    },
  },
])

export default new Router({
  mode: 'hash',
  linkActiveClass: 'link-active',
  scrollBehavior: () => ({ y: 0 }),
  routes,
})
