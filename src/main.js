import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css'
import axios from 'axios'
import { getUser, removeUser } from '@/utils/auth'
import JSONbig from 'json-bigint'
import store from './store'
// 先找文件，没有就找目录
// 如果找到目录，优先加载目录中的index
import router from './router' // 你在这人访问的router 和你在组件中访问的 this.$router是一个东西
// 引入公共样式文件，最好在element 样式文件之后，可以自定义修改element内置样式
import './styles/index.less'

// 配置axios 的基础路径
// 发请求的时候就不需要每次都写 http://xxxx
// 例如我要请求登录，直接 axios({ url: '/authorizations' })
// 路径最后的/,多退少补
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'
// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'

/*
  如何解决后端返回数据中的数字超出安全整数范围问题？
  axios 预留的自定义处理后端返回的原始数据
  可以理解成也是一个响应拦截器，这个比较特殊
  这里的data是后端返回的未经过处理的原始数据
  axios默认使用JSON.parse去转换原始数据，如果其中有超出安全整数范围的数据就有问题了
  所有我们在这里可以手动处理这个原始数据
    npm i json-bigint 这里包会把json格式字符串转换成对象，在转的过程中，判断是不是数字并且是否超出了js安全整数范围，如果超出就转换成一个对象格式，我们toString()使用
    JSONbig.parse(原始json格式字符串)
*/
axios.defaults.transformResponse = [function (data) {
  // console.log('transformResponse=>', data)
  // return data

  // 这里使用JSONbig.parse转换原始数据
  // 类似于JSON.parse
  // 但是它会处理其中超出安全整数范围的整数问题
  // 严谨一点，如果data不是json格式字符串就会报错
  try {
    // 如果是json格式字符串，那就转换并返回给后续使用
    return JSONbig.parse(data)
  } catch (err) {
    // 报错就意味着data不是json格式字符串，这里就直接原样返回给后续使用
    return data
  }
}]
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
    // config.headers.Authorization = `Bearer 123` 只为测试
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
axios.interceptors.response.use(response => { // >= 200 && 400 的状态码会进入这里
  // console.log('进入响应拦截器了', response)
  // response 就是响应结果对象
  // 这里将 responent 原样返回,那么你发请求的第二方收到的就是 response
  // 我们可以控制请求收到的响应数据格式
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, error => { // >= 400 的状态码会进入这里
  console.dir(error)
  // console.log('状态码异常', error)
  // console.dir(error) 错误对象
  // 如果用户 token 无效, 让其跳转到登录页面
  if (error.response.status === 401) {
    // 清除本地存储中的无效 token 的用户信息
    removeUser()
    // 跳转到用户登录页
    router.push({
      name: 'login'
    })
  }
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
  store, // 将 store 配置到 Vue 根实例中，然后所有组件就可以通过 this.$store来访问容器中数据了
  render: h => h(App)
}).$mount('#app')
