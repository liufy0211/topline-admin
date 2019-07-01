<template>
  <el-card>
    <div slot="header">
      <span>素材管理</span>
    </div>
    <div class="action">
      <el-radio-group v-model="active">
        <!--
          click、dblclick 是原生的DOM 事件
          el-xxx 是什么？ 这是组件标签
          el-button 怎么就有呢？ 因为这个组件将内部的点击事件做了对外发布 $emit(内部做了自定义事件发布处理)
            使用 @click 给el-button 注册点击事件，只是让你看起来像是在注册原生事件，实质是它在内部将原生的DOM的点击事件做了对外发布 $emit('click',事件参数)

            如果想要给一个组件注册一个原生事件，@原生事件.native
        -->
        <el-radio-button label="全部" @click.native="loadImages(false)"></el-radio-button>
        <el-radio-button label="收藏" @click.native="loadImages(true)"></el-radio-button>
      </el-radio-group>
      <!--
        这里我们可以戒指使用 Upload 上传组件进行图片上传
        Upload 组件支持自动请求，不用我们自己写代码，只需要配置一下请求接口
        如果要使用它默认的请求能力，就无法使用我们在axios 中做的哪些配置了，例如baseURL 请求拦截器...
          1.action请求地址
          2.headers 请求头
          3.name 字段名称

        一：:on-success="loadImages"
          将 loadImages 配置为 on-success 的成功调用函数
          那么当上传成功的时候，Upload 组件就会调用 loadImage(response, file, fileList)
          我们自己写的 loadImages 函数，期望参数是一个布尔值
        二：:on-success="loadImages(false)"
          {{ loadImages(false) }} 会调用这个函数把结果摆在这儿 v-bind里的东西和双大括号里的是一样的 也就是说，不是绑函数了，是绑函数调用的结果，一上来就被调了
          不行，因为属性绑定中会直接调用这个函数
        三：定义一个额外的函数，在这个函数中我们手动调用我们自己的 loadImages(false)
          :on-success="handleUploadSuccess"
        四：我们可以在模板中使用箭头函数(箭头函数用于on-success这个函数，它成功的时候会来调这个函数，在函数里面我们自己调loadImages())
          注意：模板中直接定义的箭头函数中使用实例成员需要加 this
       -->
      <el-upload
        :headers="{ Authorization: `Bearer ${$store.state.user.token}` }"
        name="image"
        :show-file-list="false"
        :on-success="() => { this.loadImages(false) }"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
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
              <!--
                1.注册点击事件，绑定处理函数，传递要删除的数据对象
                2.定义删除函数，发请求执行删除操作
                3.成功：提示成功
                  失败：提示失败
              -->
              <el-button
                plain type="primary"
                icon="el-icon-delete"
                circle
                @click="handleDelete(item)"
              ></el-button>
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
    },
    async handleDelete (item) {
      try {
        if (!window.confirm('Are you sure')) {
          return
        }
        await this.$http({
          method: 'DELETE',
          url: `/user/images/${item.id}`
        })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        // 重新加载数据列表
        this.loadImages()
      } catch (err) {
        this.$message.error('删除失败')
      }
    }
    // handleUploadSuccess () {
    //   // 上传成功，重新加载所有图片列表
    //   this.loadImages(false)
    // }
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
