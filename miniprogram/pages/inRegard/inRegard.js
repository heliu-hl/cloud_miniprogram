// pages/suggest/suggest.js
const app = getApp();
const db = wx.cloud.database({
  env: 'heliu-qgtlz'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTop: 0,
    text:"",
    isOpen:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navTop: app.data.navTop + 4,
    })
    this.getInfo();
    this.getIsOpen();
  },
  getInfo(){
    wx.showLoading({
      title: '加载中···',
    })
    db.collection('type').where({
      isOpen:true,
      type:"about"
    }).get().then(res=>{
      wx.hideLoading({
        success: (res) => {},
      })
      // console.log(res,"res")
      this.setData({
        text:res.data[0].text
      })
    }).catch(err=>{
      wx.hideLoading({
        success: (res) => {},
      })
      console.log(err,"err")
    })
  },
  getIsOpen(){
    db.collection('type').where({
      type:"author"
    }).get().then(res=>{
      // console.log(res,"res")
      this.setData({
        isOpen:res.data[0].isOpen
      })
    }).catch(err=>{
      console.log(err,"err")
    })
  },
  return(){
    wx.navigateBack({
      delta: 1,
    })
  },
  giveAuthor(){
    wx.navigateTo({
      url: '../payQRcode/payQRcode',
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