import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   // 在整个项目中，模块路径中的@ 表示的是 src 目录
    //   // 无论你当前模块在哪儿里，@都可以直接定位到src
    //   // 加载一个目录可以默认加载它的 index.js  index.vue  index.json
    //   component: () => import('@/views/home')

    // },
    {
      name: 'layout',
      path: '/',
      component: () => import('@/views/layout')
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
