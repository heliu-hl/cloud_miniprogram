// pages/test/test.js

// 78e6a240ebcd5a8cc93c187235755c97
// wx0afe6090f46bd61b
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inpVal: "",
    tokenId:"",
    openid:""
  },
  clickSend() {
    let {
      inpVal,
      tokenId,
      openid
    } = this.data;
    console.log(inpVal,tokenId,openid);
    let data = {
      access_token:tokenId,
      touser:openid,
      template_id:"l4hA1e4sPHQf__L-aEYq2SX0DpqYEIKXSBeH1EetaBg",
      page:"pages/home/home",
      data:{
        thing1:{
          value:inpVal
        },
        time3:{
          value:"2020-09-16"
        },
        thing4:{
          value:"wwww"
        }
      }
    }
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='+tokenId,
      method:"POST",
      data:data,
      success:res=>{
        console.log(res,"res");
      },
      fail:err=>{
        console.log(err,"err");
      }
    })
    // wx.requestSubscribeMessage({
    //   tmplIds: ["l4hA1e4sPHQf__L-aEYq2SX0DpqYEIKXSBeH1EetaBg"],
    //   success: res => {
    //     const tem = "l4hA1e4sPHQf__L-aEYq2SX0DpqYEIKXSBeH1EetaBg";
    //     if (res[tem] == "accept") {
    //       console.log("success");
    //       wx.request({
    //         url: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='+tokenId,
    //         method:"POST",
    //         data:data,
    //         success:res=>{
    //           console.log(res,"res");
    //         },
    //         fail:err=>{
    //           console.log(err,"err");
    //         }
    //       })
    //     } else if (res[tem]== "reject") {
    //       console.log("cancel");
    //     }
    //   }
    // })

  },
  getval(e) {
    this.setData({
      inpVal: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_access_token();
    this.getOpenid()
  },
   get_access_token() {
    wx.request({
        url: 'https://api.weixin.qq.com/cgi-bin/token',
        data: {
            grant_type: "client_credential",
            appid: "wx0afe6090f46bd61b",
            secret: "78e6a240ebcd5a8cc93c187235755c97"
        },
        success: res => {
            this.setData({
              tokenId:res.data.access_token
            })
        },
        fail: err => {
            console.log(err, "fail")
        }
    })
},
getOpenid(){
  wx.cloud.callFunction({
    name: 'login',
    data: {},
    success: res => {
      this.setData({
        openid: res.result.openid
      })
    },
    fail: err => {
      console.log(err)
    }
  })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})