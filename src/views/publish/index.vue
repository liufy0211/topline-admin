<template>
  <el-card class="publish-card">
    <div slot="header" class="header">
      <span>发布文章</span>
      <div>
        <el-button type="success" @click="handlePublish(false)">发布</el-button>
        <el-button type="primary" @click="handlePublish(true)">存入草稿</el-button>
      </div>
    </div>
    <el-row>
      <el-col :span="18">
         <!-- 表单 -->
        <el-form ref="form" :model="articleForm" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="articleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <!--
              bidirectional data binding（双向数据绑定）
              ref="myQuillEditor" 可以配置一些quill选项
              @blur="onEditorBlur($event)" 失去焦点的时候
              @focus="onEditorFocus($event)" 当它聚焦的时候
              @ready="onEditorReady($event)" 当富文本编辑器渲染注册好的时候
            -->
            <quill-editor v-model="articleForm.content"
              ref="myQuillEditor"
              :options="editorOption">
            </quill-editor>
          </el-form-item>
          <el-form-item label="封面">
            <!-- <el-radio-group v-model="form.resource">
              <el-radio label="线上品牌商赞助"></el-radio>
              <el-radio label="线下场地免费"></el-radio>
            </el-radio-group> -->
          </el-form-item>
          <el-form-item label="频道">
            <!--
              组件通信：
                父传子：Props Down
                子传父：Events Up
             -->
            <!-- 希望有这么一个组件 这个组件我只要用，就加载了文章频道的下拉列表 -->
            <!-- <article-channel
              :value="articleForm.channel_id"
              @input="articleForm.channel_id=$event"
            ></article-channel> -->
            <!--
              v-model 就是：
                :value="articleForm.channel_id"
                @input="articleForm.channel_id=$event"
              简写 默认绑一个value 给子组件 默认监听input事件，input事件发生以后，把数据赋值给事件传过来的参数
             -->
            <article-channel
              v-model="articleForm.channel_id"
            ></article-channel>
          </el-form-item>
        </el-form>
      <!-- 表单 -->
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './quill.user.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'AppPublish',
  components: {
    ArticleChannel,
    quillEditor
  },
  data () {
    return {
      articleForm: {
        title: '', // 标题
        content: '', // 内容
        channel_id: '', // 频道
        cover: { // 封面
          type: 0, // 封面类型 -1：自动，0-无图，1-1张，3-3张
          images: []
        }
      },
      editorOption: {} // 富文本编辑器配置选项
    }
  },
  methods: {
    async handlePublish (draft) {
      try {
        await this.$http({
          method: 'POST',
          url: '/articles',
          params: {
            draft
          },
          data: this.articleForm
        })
        this.$message({
          type: 'success',
          message: '发布成功'
        })
      } catch (err) {
        this.$message.error('发布失败', err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.publish-card {
  min-height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
