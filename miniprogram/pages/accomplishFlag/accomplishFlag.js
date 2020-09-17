// pages/home/home.js
const db = wx.cloud.database({
  env: 'heliu-qgtlz'
});
const app = getApp();
import {
  showMes
} from "../../utils/util.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    navTop: "",
    bgImg: "../../static/img/accomplishBG.jpg",
    isAddFlag: false,
    flagAll: [],
    everyDayFlag: [],
    weekFlag: [],
    monthFlag: [],
    yearFlag: [],
    _id: "",
    flagInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navTop: app.data.navTop + 4,
      openid: app.data.openid
    });
    wx.showLoading({
      title: '拼命加载中···',
    })
    this.getInfo(app.data.openid);
  },
  getInfo(openid) {
   
    let data = {
      open_id: openid,
      accomplish: true
    };
    // db.collection('backlog_schedule').where(data).get().then(res => {
    //   wx.hideLoading();
    //   // console.log(res.data, "data")
    //   res.data.map(v => {
    //     v.backlog = v.backlog.length > 5 ? v.backlog.slice(0, 5) + "···" : v.backlog
    //   })
    //   let everyDayFlag = res.data.filter(v => v.type == "1")
    //   let weekFlag = res.data.filter(v => v.type == "2")
    //   let monthFlag = res.data.filter(v => v.type == "3")
    //   let yearFlag = res.data.filter(v => v.type == "4")
    //   // console.log(everyDayFlag,"everyDayFlag");
    //   // console.log(weekFlag,"weekFlag");
    //   // console.log(monthFlag,"monthFlag");
    //   // console.log(yearFlag,"yearFlag");

    //   this.setData({
    //     flagAll: res.data,
    //     everyDayFlag,
    //     weekFlag,
    //     monthFlag,
    //     yearFlag
    //   })
    // }).catch(err => {
    //   wx.hideLoading();
    //   console.log(err, "err");
    // })


    wx.cloud.callFunction({
      name: 'getinfo',
      data: data,
      success: res => {
        wx.hideLoading()
        console.log(res, "res")

        res.result.data.map(v => {
          v.backlog = v.backlog.length > 8 ? v.backlog.slice(0, 8) + "···" : v.backlog
        });

        let everyDayFlag = res.result.data.filter(v => v.type == "1")
        let weekFlag = res.result.data.filter(v => v.type == "2")
        let monthFlag = res.result.data.filter(v => v.type == "3")
        let yearFlag = res.result.data.filter(v => v.type == "4")
        // console.log(everyDayFlag,"everyDayFlag");
        // console.log(weekFlag,"weekFlag");
        // console.log(monthFlag,"monthFlag");
        // console.log(yearFlag,"yearFlag");

        this.setData({
          flagAll: res.result.data,
          everyDayFlag,
          weekFlag,
          monthFlag,
          yearFlag
        })

      },
      fail: err => {
        wx.hideLoading()
        console.log(err)
      }
    })

  },
  clickItem(e) {
    let {
      id
    } = e.currentTarget.dataset;
    db.collection('backlog_schedule').doc(id).get().then(res => {
      this.setData({
        isAddFlag: true,
        _id: id,
        flagInfo: res.data
      })
    }).catch(err => {
      showMes("服务开小差了，请稍后再试")
      console.log(err)
    })

  },
  delBtn() {
    let {
      _id
    } = this.data;
    wx.showModal({
      title: '确认删除？',
      content: "点击确认按钮后将永久删除该Flag",
      success: (res) => {
        if (res.confirm) {
          
          db.collection('backlog_schedule').doc(_id).remove().then(res => {
            showMes("删除成功", "success")
            this.getInfo(app.data.openid);
            this.setData({
              isAddFlag: false
            })
          }).catch(err => {
            console.log(err, ":err")
            this.setData({
              isAddFlag: false
            })
          })
          this.getInfo(this.data.openid)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  closePopup() {
    this.setData({
      isAddFlag: false
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