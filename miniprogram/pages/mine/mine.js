// pages/mine/mine.js
const app = getApp();
import {showMes} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTop: 0,
    list: [
      {
        text: "清除缓存",
        url: "",
        tip: "清除",
        icon: "warning-o",
        type: "clear"
      },
      {
        text: "意见与反馈",
        url: "../suggest/suggest",
        tip: "填写",
        icon: "chat-o",
        type: ""
      },
      {
        text: "关于小程序",
        url: "../inRegard/inRegard",
        tip: "查看",
        icon: "gem-o",
        type: ""
      },
    ],
    userInfo:{}
  },

  clickItem(e) {
    let {
      type
    } = e.currentTarget.dataset;
    if (type == "clear") {
      wx.showModal({
        title: "确认清除缓存",
        confirmText:"清除",
        success(res) {
          if (res.confirm) {
            wx.clearStorage({
              success: (res) => {
                showMes("清除成功","success")
              },
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navTop: app.data.navTop + 5,
      userInfo:wx.getStorageSync('userInfo')
    })

  },
  getUserInfo(e){
    console.log(e);
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.setData({
      userInfo:e.detail.userInfo
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
    wx.setTabBarStyle({
      backgroundColor: '#00889e'
    })
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