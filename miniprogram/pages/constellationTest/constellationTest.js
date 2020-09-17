// pages/suggest/suggest.js
const app = getApp();
import {
  getInfo
} from "../../server/api.js";
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
    openid: "",
    constellationList: ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"],
    constellationType: [{
        name: "今天",
        type: "today"
      },
      {
        name: "明天",
        type: "tomorrow"
      },
      {
        name: "本周",
        type: "week"
      },
      {
        name: "本月",
        type: "month"
      },
      {
        name: "今年",
        type: "year"
      }
    ],
    type: "请选择",
    selTypeVal: "",
    constellation: "请选择",
    isOpen: true,
    key: "1b37813038bdc3945913df1c0329e837",
    info: {},
    showState:false
  },
  closePopup() {
    wx.showModal({
      title: '提示',
      content:"确认取消本次测试?",
      success(res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1,
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  testBtn() {
    let {
      type,
      selTypeVal,
      constellation
    } = this.data;
    if (constellation == "请选择") {
      showMes("请选择你的星座")
    } else if (type == "请选择") {
      showMes("请选择时间")
    } else {
      let data = {
        key: this.data.key,
        type: selTypeVal,
        consName: constellation
      }
      // console.log(data, "data");
      getInfo(data).then(res => {
        console.log(res, "res");
        this.setData({
          isOpen: false,
          info: res.data,
        })
      }).catch(err => {
        console.log(err, "err");
      })

    }
  },
  bindConstellationPicker(e) {
    this.setData({
      constellation: this.data.constellationList[e.detail.value]
    })
  },
  bindTypePicker(e) {
    this.setData({
      type: this.data.constellationType[e.detail.value].name,
      selTypeVal: this.data.constellationType[e.detail.value].type
    })
  },
  openTest(){
    this.setData({
      isOpen:true
    })
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

  return () {
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