<template>
  <div class="login-wrap">
    <!-- 给组件加class 会把这个class会把这个class作用到组件的根元素上 -->
    <div class="form-wrap">
      <div class="form-head">
        <img src="@/assets/logo_index.png" alt="黑马头条号">
      </div>
      <!--
        配置校验规则
          rules 规则对象配置到el-form上 ,rules 中配置的校验字段必须和表单数据对象保持一致
          prop  校验字段配置到el-form-item上
        Javascript 触发验证
          给el-form 添加 ref
          调用 this.$refs['ref名字'].validate(valid => {})触发验证
       -->
      <el-form
        class="form-content"
        ref="form"
        :model="form"
        :rules="rules"
      >
      <!-- ref有两个作用获取DOM，获取组件 -->
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <!-- el-col 栅格布局，一共 24 列，:span 用来指定占用的大小，:offset 用来指定偏移量 -->
          <el-col :span="14">
            <el-input v-model="form.code" placeholder="验证码"></el-input>
          </el-col>
          <el-col :offset="1" :span="9">
            <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
            <el-button
              @click="handleSendCode"
              :disabled = "!!codeTimer"
              :loading="codeLoading"
            >{{ codeTimer ? `剩余${codeTimeSeconds}秒` : '获取验证码' }}</el-button>
          </el-col>
        </el-form-item>
         <el-form-item prop="agree">
          <el-checkbox class="agree-checkbox" v-model="form.agree"></el-checkbox>
          <span class="agree-text">我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
        </el-form-item>
        <el-form-item>
          <el-button
          class="btn-login"
          type="primary"
          @click="handleLogin"
          :loading="loginLoading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import '@/vendor/gt' // 引入极验 Javascript SDK文件，通过 window.initGeetest 使用
import { saveUser } from '@/utils/auth' // 按需加载，加载模块中非 export default 成员
import initGeetest from '@/utils/init-geetest'
const initCodeTimeSeconds = 60
export default {
  name: 'AppLogin',
  data () {
    return {
      form: { // 表单数据对象
        mobile: '',
        code: '',
        agree: ''
      },
      rules: { // 验证规则对象
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // { len: 11, message: '长度必须为11位', trigger: 'blur' }
          { pattern: /\d{11}/, message: '请输入有效的手机号码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          // { len: 6, message: '长度必须为6位', trigger: 'blur' }
          { pattern: /\d{6}/, message: '请输入有效的验证码', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户提议' },
          { pattern: /true/, message: '请同意用户提议' }
        ]
      },
      codeTimer: null, // 倒计时定时器
      codeTimeSeconds: initCodeTimeSeconds, // 倒计时时间
      loginLoading: false, // 登录中 loading
      codeLoading: false
    }
  },
  methods: {
    handleLogin () {
      // const { mobile, code } = this.form
      // 使用form组件的 validate 方法触发校验，获取校验的结果状态
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        // 表单验证通过，提交登录请求
        this.submitLogin()
      })
    },
    async submitLogin () {
      this.loginLoading = true
      try {
        const userInfo = await this.$http({
          method: 'POST',
          url: '/authorizations',
          data: this.form
        })
        // res 就是then接收的那个参数，then接收的那个参数就是resolve那个参数
        // const userInfo = res.data.data
        // window.localStorage.setItem('user_info', JSON.stringify(userInfo))
        saveUser(userInfo)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        this.$message.error('登录失败，手机号或验证码错误')
      }
      this.loginLoading = false
    },
    handleSendCode () {
      // 验证手机号是否有效
      this.$refs['form'].validateField('mobile', errorMessage => {
        // console.log('errorMessage =>', errorMessage)
        if (errorMessage.trim().length > 0) {
          return
        }
        // 验证通过，初始化显示验证码
        this.showGeetest()
      })
    },
    /*
      验证通过,初始化人机交互验证码
    */
    async showGeetest () {
      try {
        this.codeLoading = true
        // 任何函数中的 function 内部的 this 指向 window
        const { mobile } = this.form
        // axios 返回promise 对象
        const data = await this.$http({
          method: 'GET',
          url: `/captchas/${mobile}`
        })
        // console.log(res.data)
        // const { data } = res.data
        const captchaObj = await initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind' // 隐藏，直接弹出式
        })
        captchaObj.onReady(() => { // console.log(captchaObj) captchaObj 验证对象 有一些事件
          this.codeLoading = false
          // 验证码ready之后才能调用verify方法显示验证码
          captchaObj.verify() // 弹出验证码内容框
        }).onSuccess(async () => {
          try {
            // your code   人机交互验证通过
            // console.log(captchaObj.getValidate())
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate } = captchaObj.getValidate()
            // 发送短信
            await this.$http({
              method: 'GET',
              url: `/sms/codes/${mobile}`,
              params: {
                challenge,
                validate,
                seccode
              }
            })
            // 发送短信成功，开始倒计时
            // console.log(res.data)
            // 开启倒计时效果
            this.codeCountDown()
          } catch (err) {
            this.$message.error('获取验证码失败')
            this.codeLoading = false
          }
        })
        // 在这里注册“发送验证码”按钮的点击事件，然后验证用户是否输入手机号以及手机号格式是否正确，没有问题：
        // captchaObj.verify
      } catch (err) {
        this.$message.error('获取验证码失败')
        this.codeLoading = false
      }
    },

    /*
      验证码倒计时
    */
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeTimeSeconds--
        if (this.codeTimeSeconds <= 0) {
          // 清楚定时器
          window.clearInterval(this.codeTimer)
          // 让倒计时的时间回归初始状态
          this.codeTimeSeconds = initCodeTimeSeconds
          // 将存储定时器引用的变量重新赋值为null
          this.codeTimer = null
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  background-color: skyblue;
  display: flex;
  justify-content: center;
  align-items: center;
  .form-head {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    img {
      width: 200px;
    }
  }
  .form-wrap {
    width: 450px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    .agree-checkbox {
      margin-right: 10px;
    }
    .agree-text {
      font-size: 16px;
      color: #999;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
