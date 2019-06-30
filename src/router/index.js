import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
import { getUser } from '@/utils/auth'

Vue.use(Router)

const router = new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   // 在整个项目中，模块路径中的@ 表示的是 src 目录
    //   // 无论你当前模块在哪儿里，@都可以直接定位到src
    //   // 加载一个目录可以默认加载它的 index.js  index.vue  index.json
    //   component: () => import('@/views/home')

    // },
    { // layout 显示到App根组件的路由出口
      // name: 'layout',  // 使用 JavaScript 命名路由导航不会渲染默认子路由
      path: '/',
      component: () => import('@/views/layout'),
      children: [ // 所有children 路由都显示到父路由的 router-view中
        {
          name: 'home',
          path: '', // 父路由的默认内容 当匹配到/就把path为空的这个组件作为router-view的默认内容
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'article',
          path: '/article',
          component: () => import('@/views/article')
        },
        {
          name: 'publish-edit',
          path: '/publish/:id',
          component: () => import('@/views/publish')
        },
        {
          name: 'comment',
          path: '/comment',
          component: () => import('@/views/comment')
        },
        {
          name: 'account',
          path: '/account',
          component: () => import('@/views/account')
        }
      ]

    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})

/*
  全局前置守卫
  当你访问路由页面的时候，会先进入这里
  to 要去哪儿里的相关数据
  from 来自哪儿里的相关数据
  next run许通过的方法
*/
router.beforeEach((to, from, next) => {
  // 路由导航前开启进度条
  nprogress.start()
  // const userInfo = window.localStorage.getItem('user_info')
  const userInfo = getUser()
  // console.log(to)
  if (to.path !== '/login') {
    // 非登录页面
    // 没有登录，跳转到登录页
    if (!userInfo) {
      // 如果是来自登录页的页面，是不会重新进行页面导航的，也就不会触发后面的 afterEach 钩子
      // 所有在这里手动结束动画，防止出现在登录页访问其他页面顶部一致loading的问题
      if (from.path === '/login') {
        nprogress.done()
      }
      next({ name: 'login' })
      // next('/login')
      // next({ path: '/login' })
    } else {
      // 登录了，run许通过
      next()
    }
  } else {
  // 登录页面
  // 没有登录，run许通过
    if (!userInfo) {
      next()
    } else {
    // 登录了，不run许通过
    // console.log(123)
    // next(false) // 中断当前导航
    // next({ name: 'home' })
      window.location.href = '/#/'
      window.location.reload()
    }
  }
})

router.afterEach((to, from) => {
  // 路由导航完成，结束进度条
  nprogress.done()
})

export default router
