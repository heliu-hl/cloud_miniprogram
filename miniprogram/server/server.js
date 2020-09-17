//错误处理
function show_error(error_alert) {
  //解决提示框一闪而过
  setTimeout(() => {
    wx.showToast({
      title: error_alert ? error_alert : '网络中断、超时、或其他异常',
      icon: 'none',
      duration: 2000
    })
    setTimeout(() => {
      wx.hideToast();
    }, 2000)
  }, 0);
}

export function request({
  url,
  data = {},
  method = 'GET',
}) {
  return new Promise((resolve, reject) => {
    requestData({
      url,
      data,
      method,
      resolve,
      reject
    })
  })
}
//发送请求
function requestData(parms) {
  const {
    resolve,
    reject,
    url,
    data,
    method,
  } = parms;
  let header;
  method === "GET" ? header = {
    'content-type': 'application/json'
  } : header = {
    'content-type': 'application/x-www-form-urlencoded'
  }
  wx.request({
    url,
    data,
    method,
    header,
    success: (res) => {

      if (res.statusCode==200) {
        resolve(res)
      } else {
        reject(res)
        show_error(res.data.msg ? res.data.msg : res.data.message)
      }
    },
    fail: (res) => {
      reject(res)
      show_error(res.errMsg)
    },
    complete: (res) => {
    }
  })
}