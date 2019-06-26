import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css'
import axios from 'axios'
import { getUser } from '@/utils/auth'
// 先找文件，没有就找目录
// 如果找到目录，优先加载目录中的index
import router from './router'
// 引入公共样式文件，最好在element 样式文件之后，可以自定义修改element内置样式
import './styles/index.less'

// 配置axios 的基础路径
// 发请求的时候就不需要每次都写 http://xxxx
// 例如我要请求登录，直接 axios({ url: '/authorizations' })
// 路径最后的/,多退少补
axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'

/**
 * Axios 请求拦截器：axios 发出去的请求会先经过这里
 * config 是本次请求相关的配置对象
 */
axios.interceptors.request.use(config => {
  // console.log('请求进入了拦截器')
  const user = getUser()

  // 如果有 user 数据，则往本次请求中添加用户 token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  // return config 是允许请求发送的开关
  // 我们可以在这之前进行一些业务逻辑操作
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * Axios 响应拦截器：axios 收到的响应会先经过这里
 */
axios.interceptors.response.use(response => {
  // console.log('进入响应拦截器了', response)
  // response 就是响应结果对象
  // 这里将 responent 原样返回,那么你发请求的第二方收到的就是 response
  // 我们可以控制请求收到的响应数据格式
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, error => {
  return Promise.reject(error)
})

Vue.use(ElementUI)
// 所有组件都是 Vue 的实例
// 我们可以把一些需要在组件中频繁使用的成员放到 Vue.prototype 中
// Vue.prototype.foo = 'bar'

// 给 Vue 原型对象扩展成员的时候，最好加上一个 $ 前缀，避免和组件内部的数据成员冲突
// 几乎所有组件都要去发请求，这样配置完以后，我们在组件中发请求就可以直接 this.$http({method url ...})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
