// pages/home/home.js
const db = wx.cloud.database({
  env: 'heliu-qgtlz'
});
const app = getApp();
import {
  timestampToTime,
  showMes
} from "../../utils/util.js";

import {question} from "../../server/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:"",
    isFlag:null,
    openid: "",
    navTop: "",
    bgImg: "../../static/img/333.jpg",
    isAddFlag: false,
    flagAll: [],
    everyDayFlag: [],
    weekFlag: [],
    monthFlag: [],
    yearFlag: [],
    flagType: [{
        name: "每天Flag，做个自律的人",
        type: "1"
      },
      {
        name: "每周Flag，每周都做了什么",
        type: "2"
      },
      {
        name: "每月月Flag，每月一小结",
        type: "3"
      },
      {
        name: "今年Flag，给自己一个交代",
        type: "4"
      }
    ],
    flagTypeVal: "请选择你的Flag类型",
    flagTypeId: "",
    flagVal: "",
    isAccomplish: false,
    flagDetail: {},
    _id: "",
    isLookDetail: false,
    menu:[],
    tipInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      navTop: app.data.navTop + 4,
      date:timestampToTime(new Date(),"week")
    })
    this.getShowFlag();
    this.getOpenid();
    this.getTip()
  },
  getOpenid() {
    wx.showLoading({
      title: '拼命加载中',
    })
    if (this.data.openid == "") {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.data.openid = res.result.openid;
          this.setData({
            openid: res.result.openid
          })
          if(this.data.isFlag){
            this.getInfo(res.result.openid)
          }else{
            this.getMenu();
           wx.setTabBarItem({
             index: 0,
             text:"菜谱"
           })
          }
          
        },
        fail: err => {
          console.log(err)
        }
      })
    } else {
      this.getInfo(this.data.openid)
    }
  },
  getInfo(openid) {

    let data = {
      open_id: openid,
      accomplish: false
    };
    // db.collection('backlog_schedule').where(data).get().then(res => {
    //   wx.hideLoading();
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
        // console.log(res, "res")

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
  getTip(){
    db.collection("type").where({
      type:"homeTip"
    }).get().then(res=>{
      // console.log(res,"res")
      this.setData({
        tipInfo:res.data[0]
      })
    }).catch(err=>{
      console.log(err,"err")
    })
  },
  getShowFlag(){
    db.collection("type").where({
      type:"flag"
    }).get().then(res=>{
      // console.log(res,"res")
      this.setData({
        isFlag:res.data[0].show
      })
    }).catch(res=>[
      console.log(err,"err")
    ])
  },
  addFlag() {
    this.setData({
      isAddFlag: true
    })
  },
  clearInfo() {
    this.setData({
      flagVal: "",
      flagTypeVal: "请选择你的Flag类型",
      flagTypeId: "",
      isAccomplish: false
    })
  },
  closePopup() {
    wx.showModal({
      title: "确认取消本次添加？",
      success: (res) => {
        if (res.confirm) {
          this.setData({
            isAddFlag: false
          })
          this.clearInfo()
        } else if (res.cancel) {

        }
      }
    })
  },
  bindFlagType(e) {
    let index = e.detail.value;
    this.setData({
      flagTypeVal: this.data.flagType[index].name,
      flagTypeId: this.data.flagType[index].type
    })
  },
  flagVinput(e) {
    this.setData({
      flagVal: e.detail.value
    })
  },
  switchChange(e) {
    this.setData({
      isAccomplish: e.detail.value
    })
  },
  confirm() {
    let {
      isAccomplish,
      flagVal,
      flagTypeVal,
      flagTypeId,
      openid
    } = this.data;
    if (flagTypeVal == "请选择你的Flag类型") {
      showMes("请选择Flag类型")
    } else if (flagVal == "") {
      showMes("请输入Flag内容")
    } else {
      wx.showLoading({
        title: '添加中',
      })
      let data = {
        accomplish: isAccomplish,
        backlog: flagVal,
        date: timestampToTime(new Date(), "time"),
        open_id: openid,
        type: flagTypeId
      }
      db.collection('backlog_schedule').add({
        data
      }).then(res => {
        wx.hideLoading();
        showMes("添加成功", "success");
        this.clearInfo();
        this.setData({
          isAddFlag: false
        })
        this.getInfo(this.data.openid)
      }).catch(err => {
        showMes("添加失败，请稍后再试");
        this.clearInfo();
        this.setData({
          isAddFlag: false
        })
        console.log(err, "err");

      })
    }
  },
  clickItem(e) {
    let {
      id
    } = e.currentTarget.dataset;

    db.collection('backlog_schedule').doc(id).get().then(res => {
      this.setData({
        flagDetail: res.data,
        _id: id,
        isLookDetail: true
      })
    }).catch(err => {
      showMes("服务开小差了，请稍后再试")
      console.log(err)
    })

  },
  closeDetail() {
    this.setData({
      isLookDetail: false
    })
  },
  lookAccomplish() {
    wx.navigateTo({
      url: '../accomplishFlag/accomplishFlag',
    })
  },
  completeBtn() {
    let {
      _id,
      openid
    } = this.data,
      data = {
        accomplish: true
      };
    db.collection('backlog_schedule').doc(_id).update({
      data
    }).then(res => {
      showMes("恭喜您，又完成了一个Flag")
      this.getInfo(openid);
      this.setData({
        isLookDetail: false
      })
    }).catch(err => {
      showMes("服务开小差了，请稍后再试")
      this.setData({
        isLookDetail: false
      })
      console.log(err, "err")
    })
  },
  delBtn() {
    let {
      _id,
      openid
    } = this.data;
    wx.showModal({
      title: '确认删除？',
      content: "点击确认按钮后将永久删除该Flag",
      success: (res) => {
        if (res.confirm) {
          db.collection('backlog_schedule').doc(_id).remove().then(res => {
            showMes("删除成功", "success");
            this.getInfo(openid);
            this.setData({
              isLookDetail: false
            })
          }).catch(err => {
            showMes("服务开小差了，请稍后再试")
            console.log(err, ":err")
            this.setData({
              isLookDetail: false
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getMenu(){
    db.collection("menu").get().then(res=>{
      wx.hideLoading({
        success: (res) => {},
      })
      console.log(res,res)
      this.setData({
        menu:res.data
      })
    }).catch(err=>{
      wx.hideLoading({
        success: (res) => {},
      })
      console.log(err,"err");
      showMes("网络开小差了，请稍后再试")
    })
    
  },
  clickMenu(e){
    let {id} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../menuDetail/menuDetail?id='+id,
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
      backgroundColor: '#3f3122',
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
   this.getInfo(this.data.openid);
   setTimeout(()=>{
     wx.stopPullDownRefresh();
   },1000)
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
  // }, {
  //   "pagePath": "pages/constellation/constellation",
  //   "text": "星座运势",
  //   "iconPath": "static/icon/xz.png",
  //   "selectedIconPath": "static/icon/xzs.png"
  // },{
//     "pagePath": "pages/keepAccounts/keepAccounts",
//     "text": "日常记账",
//     "iconPath": "static/icon/zb.png",
//     "selectedIconPath": "static/icon/zbs.png"
//   }, {
//     "pagePath": "pages/mine/mine",
//     "text": "个人中心",
//     "iconPath": "static/icon/gr.png",
//     "selectedIconPath": "static/icon/grs.png"
//   }]
// },