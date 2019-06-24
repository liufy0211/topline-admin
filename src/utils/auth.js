/*
export const getUser = () => {} 对本地存储user_info 分装了一个小模块，里面提供了三个方法
export 也用来导出，它支持导出多个成员
它的方式有个好处就是：支持按需加载，需要谁才加载谁，打包（npm run build）的时候，对于没有使用的成员就不会打包到结果中
优化了一下 对本地存储user_info有问题直接找这个模块，其他地方都在掉这里封装好的函数 推荐的做法
这种导出方式：这里就不能export default这个只能导出一个成员 export 可以导出多个成员（按需加载 按需导出）
*/
const localStorage = window.localStorage
const USER_KEY = 'user_info'

export function getUser () {
  return JSON.parse(localStorage.getItem(USER_KEY))
}

export function saveUser (data) {
  localStorage.setItem(USER_KEY, JSON.stringify(data))
}

export function removeUser () {
  localStorage.removeItem(USER_KEY)
}
