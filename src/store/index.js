/*
Vuex: 集中式状态（数据）管理
    1.
我们把不好进行组件通信交互的组件数据放到这里
使用从这里使用
    在组件中 this.$store.state.xxx
修改也从这里修改
    不要直接在组件中 this.$store.state = xxx 操作修改,调试工具观测不到，也不会记录修改数据的历史记录
    怎么修改？
    正确的做法是：在store中定义 mutation 修改 state 状态
    mutations 就好比容器的 methods
    说白了正确的做法就是
    1. 在 store 中定义一个 mutation 来修改 state 状态
    2. 在组件中调用 mutation 函数完成对状态的修改
        this.$store.commit('mutation函数名称')调用 mutation 函数，或者说叫 提交 mutation
这里的数据是和任何组件都无关的
这里的数据，任何组件都可以访问和修改
而且这里的数据也是响应式的，数据改变也会影响组件视图更新
*/
// 1.npm i vuex
// 2.下面的代码
import Vue from 'vue'
import Vuex from 'vuex'
import { getUser, saveUser } from '@/utils/auth'

Vue.use(Vuex)
// 3.下面的代码
const store = new Vuex.Store({
  // state 中的数据可以被任何组件访问
  // 在组件中直接this.$store.state.xxx 进行访问
  state: {
    user: getUser() || {} // user 的初始数据来自于本地存储
  },
  // 注意： 数据在上面 改在下面mutations 里改，其他组件来调
  mutations: {
    // mutation 函数默认接收一个参数：state,也就是说容器的state
    // 我们可以在这里通过 state.xxx = xxx 完成对容器状态的修改
    changeUser (state, user) {
    // state.user.name = '哈哈哈'
    // 将参数 user 合并到 state.user 中，说白了就是对象拷贝
      Object.assign(state.user, user)
      // 将程序中最新的用户信息重新写入本地存储，防止刷新得到旧的本地存储中的用户信息
      saveUser(state.user)
    }
  }
})
export default store
