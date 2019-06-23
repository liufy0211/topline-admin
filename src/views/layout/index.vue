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
      <el-main>Main</el-main>
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
