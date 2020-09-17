// pages/suggest/suggest.js
const app = getApp();
const db = wx.cloud.database({
  env: 'heliu-qgtlz'
});
import {showMes} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTop: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navTop: app.data.navTop + 4,
    })
  },
  return () {
    wx.navigateBack({
      delta: 1,
    })
  },
  saveImg() {
    wx.getSetting({
      success: (res) => {
        //判断他授权没有
        if (!res.authSetting['scope.writePhotosAlbum']) {
          // 授权（保存图片到本地的权限）
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: (res) => {
              this.saveImgFunc();
              console.log(res, "授权了")
            },
            fail(res) {
              console.log(res, "拒绝了")
            }
          })
        } else {
          // 已经授权
          console.log("授权过了");
          this.saveImgFunc();
        }
      }
    })
  },
  saveImgFunc() {
    wx.saveImageToPhotosAlbum({
      filePath: 'static/img/pay.jpg',
      success: res => {
        showMes("保存成功，期待大哥打赏")
      },
      fail: err => {
        console.log(err, "PPP")
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