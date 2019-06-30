<template>
  <el-card>
    <div slot="header">
      <span>素材管理</span>
    </div>
    <div class="action">
      <el-radio-group v-model="active">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="收藏"></el-radio-button>
      </el-radio-group>
      <el-button type="primary">上传图片</el-button>
    </div>
    <!-- 图片列表 gutter 栏与栏的间隔-->
     <el-row :gutter="20">
      <el-col :span="4" v-for="item in images" :key="item.id" style="margin-bottom: 10px;">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.url" class="image" style="max-width: 100%">
          <div style="padding: 10px;">
            <div class="bottom clearfix">
              <el-button
                plain type="primary"
                :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
                circle
                @click="handleCollect(item)"
              ></el-button>
              <el-button plain type="primary" icon="el-icon-delete" circle></el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'MediaList',
  data () {
    return {
      active: '全部',
      images: []
    }
  },

  created () {
    this.loadImages()
  },

  methods: {
    async loadImages (collect = false) {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/user/images',
          params: {
            collect, // 是否查询收藏图片，默认查询所有
            page: 1,
            per_page: 10
          }
        })
        // console.log(data)
        this.images = data.results
      } catch (err) {
        console.log(err)
        this.$message.error('加载图片列表失败')
      }
    },
    async handleCollect (item) {
      const collect = !item.is_collected
      try {
        const data = await this.$http({
          method: 'PUT',
          url: `/user/images/${item.id}`,
          data: {
            collect
          }
        })
        item.is_collected = data.collect
        this.$message({
          type: 'success',
          message: `${collect ? '' : '取消'}收藏成功`
        })
      } catch (err) {
        console.log(err)
        this.$message.error('收藏失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.action {
  display: flex;
  justify-content: space-between;
   margin-bottom: 20px;
}
.bottom {
  display: flex;
  justify-content: center;
}
</style>
