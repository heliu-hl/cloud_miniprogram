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
    menuDetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navTop: app.data.navTop + 4,
    })
    console.log(options.id);
    this.getGreens(options.id);
  },
  return () {
    wx.navigateBack({
      delta: 1,
    })
  },
  getGreens(id){
    wx.showLoading({
      title: '拼命加载中',
    })
    db.collection("menu").doc(id).get().then(res=>{
      wx.hideLoading({
        success: (res) => {},
      })
      console.log(res,res)
      this.setData({
        menuDetail:res.data
      })
    }).catch(err=>{
      wx.hideLoading({
        success: (res) => {},
      })
      console.log(err,"err")
      showMes("网络开小差了，请稍后再试")
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