import '@/vendor/gt'

export default function (options) {
  return new Promise((resolve, reject) => {
    window.initGeetest(options, captchaObj => {
      resolve(captchaObj)
    })
  })
}

// const captchaObj = await initGeetest({
//   challenge: data.challenge,
//   offline: !data.success,
//   new_captcha: data.new_captcha,
//   product: 'bind' // 隐藏，直接弹出式

// })
