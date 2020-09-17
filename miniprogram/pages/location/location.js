// pages/location/location.js
const app = getApp();
const chooseLocation = requirePlugin('chooseLocation');
// OKNBZ-DGJCS-5ZPOC-6OVYF-QUPL3-J6FRS
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTop: "",
    scaleVal: 16,
    start: "",
    end: "你要去哪里",
    latitude: "",
    longitude: "",
    markers: [],
    polyline: [],
    startInfo: {},
    endInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.clearStorageSync("type")
    this.setData({
      navTop: app.data.navTop + 4,
    })
    this.getLocation();
  },
  getLocation() {
    wx.getLocation({
      success: res => {
        this.coordinateAddress(res.latitude, res.longitude)
        this.addressPoi(res.latitude, res.longitude)
        this.changeAddress(res.latitude, res.longitude)
      },
      fail: err => {
        console.log(err, "err")
      }
    })
  },
  selectLocation(e) {
    let {
      type
    } = e.currentTarget.dataset;
    wx.setStorageSync('type', type)
    const key = "OKNBZ-DGJCS-5ZPOC-6OVYF-QUPL3-J6FRS",
      referer = "一起来立个Flag吧";
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}`,
    })
  },
  bindpoiChange(e) {
    //   // console.log(e.detail)
    //   this.coordinateAddress(e.detail.latitude,e.detail.longitude)
    //   this.addressPoi(e.detail.latitude,e.detail.longitude)
    //   this.changeAddress(e.detail.latitude,e.detail.longitude)
  },
  coordinateAddress(latitude, longitude) {
    wx.serviceMarket.invokeService({
      service: 'wxc1c68623b7bdea7b',
      api: 'rgeoc',
      data: {
        location: `${latitude},${longitude}`,
      },
    }).then(res => {
      // console.log(typeof res.data)
      if (typeof res.data == "string") {
        this.setData({
          start: JSON.parse(res.data).result.address
        })
      } else if (typeof res.data == "object") {
        this.setData({
          start: res.data.result.address
        })
      }

    }).catch(err => {
      console.error('invokeService fail', err)
    })
  },
  addressPoi(latitude, longitude) {
    this.setData({
      markers: [{
        id: 1,
        latitude: latitude,
        longitude: longitude,
        // iconPath: "../../static/img/qidian.png",
        // width: "50rpx",
        // height: "70rpx",
      }],
      startInfo: {
        latitude: latitude,
        longitude: longitude
      }
    })
  },
  changeAddress(latitude, longitude) {
    this.setData({
      latitude: latitude,
      longitude: longitude,
    })
  },
  addScale() {
    if (this.data.scaleVal < 18) {
      this.setData({
        scaleVal: this.data.scaleVal + 1
      })
    }

  },
  subScale() {
    if (this.data.scaleVal > 3) {
      this.setData({
        scaleVal: this.data.scaleVal - 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  locationAddress() {
    this.getLocation();
    this.showPolyline();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let {
      polyline
    } = this.data
    let type = wx.getStorageSync('type');
    const location = chooseLocation.getLocation();
    // console.log(location, "locatin");

    if (location) {
      if (type == "start") {
        this.setData({
          start: location.address,
          startInfo: location
        }, () => {
          this.showPolyline();
        })
      } else if (type == "end") {
        this.setData({
          end: location.address,
          endInfo: location,
        }, () => {
          this.showPolyline();
        })
      } else {
        this.setData({
          end: ""
        })
      }
    }
    // console.log(arr,"arr")
    // console.log(marker,"marker")

  },

  showPolyline() {
    let {
      endInfo,
      startInfo
    } = this.data;

    // console.log(endInfo,startInfo);

    if (endInfo != {} && startInfo != {}) {

      wx.serviceMarket.invokeService({
        service: 'wxc1c68623b7bdea7b',
        api: 'directionWalking',
        data: {
          from: `${startInfo.latitude},${startInfo.longitude}`,
          to: `${endInfo.latitude},${endInfo.longitude}`,

        },
      }).then(res => {
        if (typeof res.data == "string") {
          console.log(JSON.parse(res.data))
          const data = JSON.parse(res.data)
          this.PolylineFunc(data.result.routes[0].polyline)

        } else if (typeof res.data == "object") {
          this.PolylineFunc(res.data.result.routes[0].polyline)
        }

      }).catch(err => {
        console.error('invokeService fail', err)
      })


      // arr[0] = {
      //   latitude: startInfo.latitude,
      //   longitude: startInfo.longitude
      // }
      // arr[1] = {
      //   latitude: endInfo.latitude,
      //   longitude: endInfo.longitude
      // }

    }
  },



  PolylineFunc(coors) {
    let {
      endInfo,
      startInfo
    } = this.data;
    let pl = [], arr = [],
    marker = [];
    for (let i = 2; i < coors.length; i++) {
      coors[i] = Number(coors[i - 2]) + Number(coors[i]) / 1000000;
    }
    for (var i = 0; i < coors.length; i += 2) {
      pl.push({
        latitude: coors[i],
        longitude: coors[i + 1]
      })
    }
    marker[0] = {
      id: 1,
      latitude: startInfo.latitude,
      longitude: startInfo.longitude,
      title: "起点"
    }
    marker[1] = {
      id: 2,
      latitude: endInfo.latitude,
      longitude: endInfo.longitude,
      color: "#d32323",
      title: "终点"
    }
    this.setData({
      markers: marker,
      polyline: [{
        points: pl,
        color: "#E74C3C",
        width: 4,
      }]
    }, () => {
      // console.log(this.data.polyline);
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