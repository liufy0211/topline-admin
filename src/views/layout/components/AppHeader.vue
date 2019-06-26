<template>
  <el-row :gutter="20" class="header">
    <el-col :span="12">时事热点</el-col>
    <el-col :span="3" :offset="9">
      <el-dropdown trigger="click" @command="handleCommand">
        <img width="35" :src="userInfo.photo" class="user-avatar">
        <span class="el-dropdown-link">
          {{ userInfo.name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">用户设置</el-dropdown-item>
          <el-dropdown-item command="b">git地址</el-dropdown-item>
          <hr>
          <el-dropdown-item @click.native="handleLogout">退出</el-dropdown-item>
          <!--
            我们可以使用 .native 事件修饰符将原生的 html 事件注册到组件的根元素
           -->
          <!-- <el-dropdown-item command="c">退出</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
import { removeUser, getUser } from '@/utils/auth'
export default {
  name: 'AppHeader',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    // this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
    this.userInfo = getUser()
  },
  methods: {
    handleLogout () {
      this.$confirm('确认推出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清空本地存储中的 user_info
        // window.localStorage.removeItem('user_info')
        removeUser()
        // 然后跳转到登录页
        this.$router.push({ name: 'login' })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    handleCommand (dropdownItem) {
      console.log('handCommand', dropdownItem)
    }
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
