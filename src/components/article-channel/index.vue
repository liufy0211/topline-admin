<template>
<!--
  el-select 组件
    value属性，用来绑定同步的数据
    change 事件，当选中项发生改变被触发，回调参数就是选中项的value
 -->
   <el-select :value="value" clearable @change="handleChange">
     <el-option
       v-for="item in channels"
       :key="item.id"
       :label="item.name"
       :value="item.id"
      ></el-option>
     </el-select>
</template>

<script>
export default {
  name: 'ArticleChannel',
  props: {
    value: {
      type: [String, Number],
      require: true
    }
  },
  data () {
    return {
      channels: []
    }
  },
  created () {
  // 加载频道列表
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/channels'
        })
        this.channels = data.channels
      } catch (err) {
        this.$message.error('获取频道数据失败', err)
      }
    },
    handleChange (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
