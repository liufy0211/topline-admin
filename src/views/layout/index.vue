<template>
  <el-container>
    <el-aside width="200px">
      <!-- 侧边栏 -->
      <AppAside/>
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <AppHeader/>
      </el-header>
      <!-- 内容 -->
      <el-main>
        <!-- Home、发布文章、文章列表、评论...都显示在这里 -->
        <!-- router-view 默认会缓存 x-y相同组件 之前这样做是可以的-->
        <!--
          key 一定确保唯一 $route路由参数对象 path 当前导航的路由路径 路由做导航的时候加了key 有点像v-for加key是的
          禁用路由缓存，只需要给router-view 添加一个唯一的key即可
          这样路由就不会缓存组件了
          这个key要确保唯一

          禁用路由缓存不是必须的，看情况
          如果你要刻意使用默认的路由缓存能力，那么就不要禁用，去被缓存的路由中通过
            方式一：监视$route做处理
            方式二：2.2新增的beforeRouteUpdate 路由导航狗子做处理
        -->

        <router-view :key="$route.path"/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'
export default {
  name: 'AppLayout',
  components: {
    AppAside,
    AppHeader
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.el-container{
  height: 100%;
}
.el-aside {
  background-color: #343a46;
}
.el-header {
}
.el-main {
  background-color: #f3f4f6;
}
</style>
