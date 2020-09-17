// pages/mine/mine.js
const app = getApp();
import {
  showMes,
  timestampToTime
} from "../../utils/util.js";

const db = wx.cloud.database({
  env: 'heliu-qgtlz'
});

const date = new Date();
var curYear = date.getFullYear();
var curMonth = date.getMonth() + 1;
var curDay = date.getDate();



Page({
  /**
   * 页面的初始数据
   */
  data: {
    endTime: curYear + '-' + curMonth + '-' + curDay,
    openid: "",
    navTop: 0,
    accountList: [],
    filterVal: "全部账单",
    isAdd: false,
    isFilter: false,
    filterAccountType: [],
    filterAccountDate: [],
    accountType: [],
    date: "请选择",
    type: "请选择",
    money: "",
    total: 0,
    isDetail: false,
    accountInfo: {},
    id: "",
    filterType: "请选择",
    filterDate: "请选择"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navTop: app.data.navTop + 5,
      openid: app.data.openid
    });
    wx.showLoading({
      title: '拼命加载中',
    })
    this.getType();
    this.getAccount();
  },
  getAccount() {

    let data = {
      openid: this.data.openid
    };

    wx.cloud.callFunction({
      name: 'getAccount',
      data: data,
      success: res => {
        if (res.result.data.length == 0) {
          wx.hideLoading()
          this.setData({
            accountList: [],
            total: 0
          })
        } else {
          this.countTotal(res.result.data);
          wx.hideLoading()
          // console.log(res, "res")
          let allArr = [],
            arr = res.result.data,
            filterDate = [];
          for (let i = 0; i < arr.length; i++) {
            let str = arr[i].timeQuantum;
            let obj = {};
            obj.sortTime = arr[i].date;
            filterDate.push(str);
            obj.time = str.slice(0, 4) + "年" + str.slice(5) + "月";
            obj.account = arr.filter(v => v.timeQuantum == str);
            allArr.push(obj)
          }
          // allArr = this.deWeight(allArr);
          filterDate = Array.from(new Set(filterDate.sort((a, b) => b.localeCompare(a))));
          filterDate.unshift("全部");
          // console.log(filterDate)
          this.setData({
            accountList: this.deWeight(allArr).sort((a, b) => b.sortTime.localeCompare(a.sortTime)),
            filterAccountDate: filterDate,
            filterType: "请选择",
            filterDate: "请选择"
          })
        }

      },
      fail: err => {
        wx.hideLoading()
        console.log(err,"err")
      }
    })

  },
  countTotal(arr) {
    let total = arr.map(v => v.money).reduce((cur, pre) => cur + pre);
    this.setData({
      total
    })
  },
  // 数组对象去重
  deWeight(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i].time == arr[j].time) {
          arr.splice(j, 1);
          //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
          j--;
        }
      }
    }
    return arr;
  },
  clickItem(e) {
    let {
      id
    } = e.currentTarget.dataset;
    db.collection("account").doc(id).get().then(res => {
      this.setData({
        accountInfo: res.data,
        id
      })
    }).catch(err => {
      console.log(err, "err")
    })
    this.setData({
      isDetail: true
    })
  },
  detailCancel() {
    this.setData({
      isDetail: false
    })
  },
  delAccount() {
    let {
      id
    } = this.data;
    wx.showModal({
      title: '确认删除 ？',
      content: '删除后将不可恢复，请谨慎操作',
      success: (res) => {
        if (res.confirm) {
          db.collection("account").doc(id).remove().then(res => {
            showMes("删除成功", "success");
            this.getAccount();
            this.setData({
              isDetail: false
            })
          }).catch(err => {
            console.log(err, "err")
            showMes("删除失败，请稍后再试");
          })
        } else if (res.cancel) {
          console.log('用户点击取消')

        }
      }
    })
  },

  getType() {
    db.collection("type").where({
      type:"accountType"
    }).get().then(res => {
      // console.log(res.data,"data")
      let typeList = [],
        filterType = ["全部"];
      res.data.map(v => {
        typeList.push(v.accountType);
        filterType.push(v.accountType);
      });
      this.setData({
        accountType: typeList,
        filterAccountType: filterType
      })
    }).catch(err => {
      console.log(err, "err")
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })

  },
  bindTypeChange(e) {
    this.setData({
      type: this.data.accountType[e.detail.value]
    })
  },
  moneyVal(e) {
    this.setData({
      money: e.detail.value
    })
  },
  clearInfo() {
    this.setData({
      date: "请选择",
      type: "请选择",
      money: ""
    })
  },
  addConfirm() {
    let {
      type,
      money,
      date,
      openid
    } = this.data;
    if (type == "请选择" || date == "请选择" || money == "") {
      showMes("请把信息完善后再提交");
      return
    } else {
      wx.showLoading({
        title: '添加中···',
      })
      let data = {
        type,
        date,
        openid,
        money: ~~money,
        createDate: timestampToTime(new Date(), "time"),
        timeQuantum: date.slice(0, 7)
      }
      db.collection("account").add({
        data
      }).then(res => {
        wx.hideLoading({
          success: (res) => {},
        })
        showMes("添加成功", "success")
        this.getAccount();
        this.setData({
          isAdd: false
        })
        this.clearInfo();
      }).catch(err => {
        wx.hideLoading({
          success: (res) => {},
        })
        this.clearInfo();
        console.log(err, "err")
        showMes("添加失败，请稍后再试")
        this.setData({
          isAdd: false
        })
      })

    }
  },
  addCancel() {
    this.clearInfo();
    this.setData({
      isAdd: false
    })
  },
  filterAccount() {
    this.setData({
      isFilter: true
    })
  },
  addAccount() {
    this.setData({
      isAdd: true
    })

  },
  filterConfirm() {
    let {
      filterType,
      filterDate,
      openid
    } = this.data;

    if ((filterType == "全部" || filterType == "请选择") && (filterDate == "全部" || filterDate == "请选择")) {
      this.getAccount();
      this.setData({
        isFilter: false
      })
    } else if (filterType == "全部" || filterType == "请选择") {
      let data = {
        timeQuantum: filterDate,
        openid: openid
      }
      this.filterFunc(data);
    } else if (filterDate == "全部" || filterDate == "请选择") {
      let data = {
        type: filterType,
        openid: openid
      }
      this.filterFunc(data);
    } else {
      let data = {
        type: filterType,
        timeQuantum: filterDate,
        openid: openid
      }
      this.filterFunc(data);
    }
  },
  filterFunc(data) {
    wx.cloud.callFunction({
      name: 'filterAccount',
      data: data,
      success: res => {
        if (
          res.result.data.length === 0
        ) {
          this.setData({
            accountList: [],
            isFilter: false,
            total: 0
          })
        } else {
          this.countTotal(res.result.data);
          console.log(res, "res")
          let allArr = [],
            arr = res.result.data;
          for (let i = 0; i < arr.length; i++) {
            let str = arr[i].timeQuantum;
            let obj = {};
            obj.sortTime = arr[i].date;
            // filterDate.push(str);
            obj.time = str.slice(0, 4) + "年" + str.slice(5) + "月";
            obj.account = arr.filter(v => v.timeQuantum == str);
            allArr.push(obj)
          }
          // allArr = this.deWeight(allArr);
          // filterDate = Array.from(new Set(filterDate.sort((a, b) => b.localeCompare(a))));
          // filterDate.unshift("全部");
          this.setData({
            accountList: this.deWeight(allArr).sort((a, b) => b.sortTime.localeCompare(a.sortTime)),
            // filterVal: this.data.filterType,
            // filterAccountDate:filterDate,
            isFilter: false
          })
        }

      },
      fail: err => {
        console.log(err, "err")
      }
    })
  },
  filterCancel() {
    this.setData({
      isFilter: false
    })
  },
  bindFilterTypeChange(e) {
    this.setData({
      filterType: this.data.filterAccountType[e.detail.value]
    })
  },
  bindFilterDateChange(e) {
    this.setData({
      filterDate: this.data.filterAccountDate[e.detail.value]
    })
  },
  allAccountBtn() {
    this.getAccount();
    this.setData({
      filterType: "请选择",
      filterDate: "请选择"
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
      backgroundColor: '#e93f4b'
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


// [{}, {}, {}]

// [
//   {
//     "2020-08":[]
//   }
// ]