// pages/constellation/constellation.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTop:"",
    deg:360,
    rotateAnimation:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navTop: app.data.navTop + 4,
    })
    
    // wx.request({
    //   url: 'https://web.juhe.cn:8080/constellation/getAll?consName=水瓶座&type=today&key=1b37813038bdc3945913df1c0329e837',
    //   success:res=>{
    //     console.log(res)
    //   },
    //   fail:err=>{
    //     console.log(err,"err")
    //   }
    // })
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
      backgroundColor: '#212a43',
      border:"transparent"
    });
    this.rotateAnimation();
    this.timer = setInterval(() => {
      this.rotateAnimation();
      console.log(1)
    }, 30000);
  },

  rotateAnimation() {
    let rotateAnimation = wx.createAnimation({
      duration: 30000,
      timingFunction: 'linear'
    });
    rotateAnimation.rotate(this.data.deg).step();
    let deg = this.data.deg+360;
    this.setData({
      rotateAnimation,
      deg
    })
  },
  test(){
    wx.navigateTo({
      url: '../constellationTest/constellationTest',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.timer)
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



// "tabBar": {
//   "color": "#8a8a8a",
//   "selectedColor": "#1296db",
//   "list": [{
//     "pagePath": "pages/home/home",
//     "text": "FLAG",
//     "iconPath": "static/icon/db.png",
//     "selectedIconPath": "static/icon/dbs.png"
//   }, {
//     "pagePath": "pages/constellation/constellation",
//     "text": "星座运势",
//     "iconPath": "static/icon/xz.png",
//     "selectedIconPath": "static/icon/xzs.png"
//   }, {
//     "pagePath": "pages/mine/mine",
//     "text": "个人中心",
//     "iconPath": "static/icon/gr.png",
//     "selectedIconPath": "static/icon/grs.png"
//   }]
// },