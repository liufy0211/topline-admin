<template>
  <el-row :gutter="20" class="header">
    <el-col :span="12">时事热点</el-col>
    <el-col :span="3" :offset="9">
      <el-dropdown>
        <img width="35" :src="userInfo.photo" class="user-avatar">
        <span class="el-dropdown-link">
          {{ userInfo.name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>用户设置</el-dropdown-item>
          <el-dropdown-item>git地址</el-dropdown-item>
          <hr>
          <el-dropdown-item>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'AppHeader',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  }
}
</script>

<style land="less" scoped>
.header {
  line-height: 60px;
}
.user-avatar {
  border-radius: 50%;
  vertical-align: middle;
}
</style>
