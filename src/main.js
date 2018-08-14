// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import router from './router'
import filters from './common/filters'
import components from './components'
import App from './App'
import './styles/common.scss'
import path from './router/path'
import './common/permission'

// 自定义组件扩展
Object.keys(components).forEach((key) => {
  const name = key.replace(/(\w)/, v => v.toUpperCase())
  Vue.component(`${name}`, components[key])
})

// 自定义过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    path,
  },
  store,
  router,
  components: { App },
  template: '<App/>',
})
