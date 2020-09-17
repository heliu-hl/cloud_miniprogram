// pages/suggest/suggest.js
const app = getApp();
const db = wx.cloud.database({
  env: 'heliu-qgtlz'
});
import {
  timestampToTime,
  showMes
} from "../../utils/util.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTop: 0,
    openid:"",
    suggestList:["关于Flag","关于账单","关于程序","关于作者","期待功能","其它意见"],
    selSuggest:"关于作者",
    suggestVal:""
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navTop: app.data.navTop + 4,
      openid: app.data.openid
    })
  },
  changeSuggsest(e){
    let {type} = e.currentTarget.dataset;
    this.setData({
      selSuggest:type
    })
  },
  textareaInp(e){
    this.setData({
      suggestVal:e.detail.value
    })
  },
  submit(){
    let {selSuggest,suggestVal,openid} = this.data;
    if(suggestVal==""){
      showMes("意见不能为空")
      return
    }else{
      wx.showLoading({
        title: '提交中···',
      })
      let data = {
        date:timestampToTime(new Date(),"time"),
        suggest:suggestVal,
        type:selSuggest,
        openid:openid
      };
      db.collection("suggest").add({data}).then(res=>{
        wx.hideLoading({
          success: (res) => {},
        })
        console.log(res,"res")
        showMes("提交成功","success");
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1500);
        
      }).catch(err=>{
        wx.hideLoading({
          success: (res) => {},
        })
        console.log(err,"err")
      })
    }
  },
  return(){
    wx.navigateBack({
      delta: 1,
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