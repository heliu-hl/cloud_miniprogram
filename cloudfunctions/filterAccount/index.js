// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'heliu-qgtlz'
})
const db = cloud.database({
  env: 'heliu-qgtlz'
})


const MAX_LIMIT = 100;


exports.main = async (event, context) => {
  console.log(event,"event")
  let data = {
    openid:event.openid,
    type:event.type,
    timeQuantum:event.timeQuantum,
  }
  // 先取出集合记录总数
  const countResult = await db.collection('account').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('account').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where(data).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}