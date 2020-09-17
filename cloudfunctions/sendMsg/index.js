// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const result = await cloud.openapi.subscribeMessage.send({
    touser: wxContext.OPENID,
    templateId: "IBccpXMl-9YXTSAOwv1w3NDCTTjXM_pbNVdjQvC-pUY",
    page: "pages/test/test",
    data: {
      date2: {
        value: '339208499'
      },
      thing1: {
        value: '2015年01月05日 12:30'
      },
      thing5: {
        value: '腾讯微信总部'
      },
      thing6: {
        value: '哈哈哈'
      }
    },
    miniprogramState:"developer"
  })
  console.log(result,"result");
  
  return result
}