// pages/dialogue/dialogue.js
const app = getApp();
import {
  showMes
} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTop: "",
    openid: "",
    value: "",
    chatList: [],
    scrollTop:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navTop: app.data.navTop + 5,
      openid: app.data.openid
    });
    
  },
  getVal(e) {
    this.setData({
      value: e.detail.value
    })
  },
  sendMsg() {
    let {chatList} = this.data;
    let {
      value
    } = this.data;
    if (value == "") {
      showMes("请输入内容")
    } else {
      chatList.push(value)
      this.setData({
        chatList: chatList,
        value:"",
        scrollTop:chatList.length*400
      })
      wx.serviceMarket.invokeService({
        service: 'wxcae50ba710ca29d3',
        api: 'thumbupbot',
        data: {
          q: value
        },
      }).then(res => {
        console.log(JSON.parse(res.data));
        if (typeof res.data == "string") {
          let result = JSON.parse(res.data).data_list[0].result;
          this.data.chatList.push(result)
          this.setData({
            chatList: this.data.chatList,
            scrollTop:this.data.chatList.length*400
          })
        } else if (typeof res.data == "object"){
          let result = res.data.data_list[0].result;
          this.data.chatList.push(result)
          this.setData({
            chatList: this.data.chatList,
          })
        }
         
      }).catch(err => {
        console.error(err)
      })
    }
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