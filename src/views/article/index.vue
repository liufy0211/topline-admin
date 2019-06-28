<template>
  <div>
    <!-- 数据筛选 -->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <el-form ref="form" :model="filterParams" label-width="80px">
        <el-form-item label="状态">
          <el-radio-group v-model="filterParams.status">
            <el-radio label="">全部</el-radio>
            <el-radio
            v-for="(item, index) in statTypes"
            :key="item.label"
            :label="index"
            >{{ item.label }}</el-radio>
            <!-- 把它的文本放到标签的中间，这里绑一个label，它选中的时候，它会把label的值，同步到字段当中 -->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="filterParams.channel_id" clearable>
            <el-option
              v-for="item in channels"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <!-- 不绑定v-model change时间不触发 api说明 实际上我们要的不是 range_date 它只是为了触发change事件 事件不触发我们也没办法处理我们想要的时间格式-->
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="range_date"
            @change="handleDateChange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
          type="primary"
          @click="handleFilter"
          :loading="articleLoading"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 数据筛选 -->
    <!-- 文章列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>一共有<strong>{{ totalCount }}</strong>条数据</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <!--
          table 表格不需要我们自己去手动 v-for 遍历
          你只需要将数组数据交给 table 表格的 data 属性就可以了
          然后配置 el-table-column 表格列组件即可
              label 列头标题
              prop  遍历项中的数据字段(遍历项就是数组中的每一个对象)
              width 列宽
              表格默认把数据当做文本去输出
              如果需要其他数据格式,则可以自定义表格列
       -->
       <el-table
         class="article-list"
         :data="articles"
         style="width: 100%"
         v-loading="articleLoading">
           <el-table-column
            label="封面"
            width="180">
            <!--
                template 中的内容就是自定义表格列的内容
                如果需要在 template 中访问遍历项数据,则需要给 template 配置 slot-scope="scope"
                    slot-scope 属性名是固定的
                    scope 值是自己随便起的名字
                结果就是:我们可以通过 scope.row 访问到当前遍历项对象,就好比我们遍历中的 item 一样
                scope.row 就比如说我们在数组中一个一个的对象
             -->
            <template slot-scope="scope">
              <img
                width="20"
                v-for="item in scope.row.cover.images"
                :key="item"
                :src="item">
              <!-- <strong>{{ scope.row.title }}</strong> item 就是图片路径-->
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            width="180">
          </el-table-column>
           <el-table-column
            label="状态"
            width="180">
            <template slot-scope="scope">
              <el-tag :type="statTypes[scope.row.status].type">{{ statTypes[scope.row.status].label }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="pubdate"
            label="发布时间"
            width="180">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain>修改</el-button>
              <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
          <!--
            数据分页
            page-size 配置每页大小，默认是 10
            total 用来配置总记录数
            分页组件会根据每页大小和总记录数进行分页
            current-page 当前高龄的页码，需要和数据保持同步，否则可能会出现数据页码改变，视图页码没变的情况
            -->
            <!-- :current-page="page" 高亮的页面状态 数据回到第一页，页码也得回到第一页 -->
        <el-pagination
          background
          :current-page="page"
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="totalCount"
          :disabled="articleLoading"
          @current-change="handleCurrentChange">
        </el-pagination>
      <!-- /数据分页 -->
    </el-card>
    <!-- 文章列表 -->
  </div>
</template>

<script>
// import { getUser } from '@/utils/auth'
export default {
  name: 'ArticleList',
  data () {
    return {
      articles: [],
      statTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      pageSize: 10, // 每页大小
      totalCount: 0, // 总数据量
      page: 1, // 当前页面
      articleLoading: false, // 加载中
      filterParams: {
        status: '', // 文章状态
        channel_id: '', // 频道id
        begin_pubdate: '', // 开始时间
        end_pubdate: '' // 结束时间
      },
      range_date: '', // 时间范围绑定值，这个字段的意义是为了绑定 date 组件出发 change 事件
      channels: [] // 所有频道
    }
  },

  created () {
    this.loadArticles()
    this.loadChannels()
  },

  methods: {
    async handleDelete (item) {
      // console.log(item.id.toString())
      try {
        // 删除确认提示
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 如果手动 catch 了它的异常，还是会被外部的try-catch捕获到
        // 但是代码依然可以继续往后执行
        // .catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消删除'
        //   });
        // })
        // 确认：执行删除操作
        await this.$http({
          method: 'DELETE',
          url: `/articles/${item.id}`
        })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        // 删除成功重新加载数据列表 loadArticles()是async函数 返回promise
        this.loadArticles()
      } catch (err) {
        if (err === 'cancel') {
          return this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
        this.$message.error('删除失败')
        // console.log(err) cancel
      }
    },
    // value 日期组件的值
    handleDateChange (value) {
      // console.log(value)
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
    },
    async loadChannels () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/channels'
        })
        // console.log(data)
        this.channels = data.channels
      } catch (err) {
        console.log(err)
        this.$message.error('获取频道数据失败')
      }
    },
    handleFilter () {
      // 点击查询按钮，根据表单中的数据查询文章列表
      this.page = 1 // 查询从第一页开始加载数据
      this.loadArticles()
    },
    async loadArticles () {
      try {
        // 请求开始，加载 loading
        this.articleLoading = true
        // const token = getUser().token
        // 除了登录相关接口之后。其他接口都必须在请求头中通过 Authorization 字段提供用户 token
        // 当我们登录成功，服务端会生成一个 token 令牌，放到用户信息中

        const filterData = {}
        // 无效数据判断
        for (let key in this.filterParams) {
          const item = this.filterParams[key]
          if (item !== null && item !== undefined && item !== '') {
            filterData[key] = item
          }
          // 数据中的0 参与布尔值运算是 false 不会进来
          // if (item) {
          //   filterData[key] = item
          // }
        }
        const data = await this.$http({
          method: 'GET',
          url: '/articles',
          params: {
            page: this.page, // 页码
            per_page: this.pageSize, // 每页数量
            ...filterData
          }
          // params: Object.assign({
          //   page: this.page, // 页码
          //   per_page: this.pageSize, // 每页数量
          //   //...filterData  filterData 混入当前对象中，对象混入语法
          // }, filterData)
          // headers: {  // 自定义请求头
          //   Authorization: `Bearer ${token}`  // 后端要求：将token以'Bearer token'的数据格式放到请求头的Authorization字段中
          // }
        })
        // console.log(data)
        this.articles = data.results
        this.totalCount = data.total_count

        // 请求结束，停止 loading
        this.articleLoading = false
      } catch (err) {
        this.$message.error('加载文章列表失败', err)
      }
    },
    handleCurrentChange (page) {
      // console.log(page) 将数据中的页码修改为当前最新改变的数据页码
      this.page = page
      // 页码改变重新加载当前文章列表
      this.loadArticles()
    }
  }
}
/*
  注意：程序中的数据id和服务端返回的原始数据id不一致
  原因是该数字id超出了Javascript的安全整数范围，无法精确表示，会出现偏差
  Javascript 最大能表示的安全整数范围是：Number.MAX_SAFE_INTEGER 9007199254740991
  服务端返回的原始数据 肯定是超出了9007199254740991，JavaScript 无法安全表示

  这里我们可以使用一个第三方包 json-bigint, 配置axios手动解析后端返回的JSON格式数据
  axios 解析完的对象中的数字已经有问题了
  对于这种问题，axios 给你提供了一个API，可以手动解析原始数据
  我们就可以在axios提供的那个API中使用json-bigint去解析含有超出安全整数范围的json内容数据

  它会将json转为JavaScript对象，它自动判断内容中数字如果超出安全整数范围，自动处理成其他格式
  JSONbig.parse(json)
*/
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 20px;
}
.article-list {
  margin-bottom: 30px;
}
</style>
