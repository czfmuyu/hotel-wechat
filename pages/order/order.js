import PromiseFn from '../../utils/httpsPromisify';
const app = getApp();
Page({
  data: {
    text: "This is page data.",
    imgurl: app.globalData.imgUrl,
    'currentTab': 0,
    haveorder: true,
    allorder: true,
    listMsg: "",
    payedOrder: ""
  },
  //#滑动切换
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //#点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //当前订单查看订单
  goDetailOrder: function(e) {
    var orderCode = e.currentTarget.dataset.ordercode;
    wx.navigateTo({
      url: '../orderdetail/orderdetail?orderCode=' + orderCode,
    })
  },
  //电话
  phoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phone,
    })
  },
  onLoad: function(options) {
    // Do some initialize when page load.
  },
  onReady: function() {
    // Do something when page ready.
  },
  onShow: function() {
    if (!app.globalData.userId) {
      wx.showModal({
        title: '提示',
        content: '是否去登录？',
        confirmText:'去登录',
        cancelText:'暂不',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.navigateTo({
              url: '../login/login'   　// 跳登陆
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
            wx.switchTab({
              url: '../index/index'   　// 跳首页
            })
          }
        }
      })
    }
    var that = this;
    //当前入住的订单
    that.orderPayed();
    //全部订单接口
    that.allList();
  },
  //全部订单接口
  allList: function() {
    var that = this;
   app.request({
      url: app.globalData.devUrl + '/order/searchAllOrder',
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: app.globalData.userId
      },
      success: function(res) {
       // console.log(res)
        var listmsg = res.data.data;
        if (listmsg.length == 0 || listmsg == null) {
          that.setData({
            allorder: false,
          })
        } else {
          // console.log(res)
          that.setData({
            allorder: true,
            listMsg: listmsg
          })
        }
      }
    })
  },
  //当前订单接口，显示需要入住的订单
  orderPayed: function() {
    var that = this;
    app.request({
      url: app.globalData.devUrl + '/order/paidOrder',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: app.globalData.userId
      },
      success: function(res) {
        // console.log(res);
        var msg = res.data.data;
        if (msg.length == 0 || msg == null) {
          that.setData({
            haveorder: false
          })
        } else {
          that.setData({
            haveorder: true,
            payedOrder: msg
          })
        }
      }
    })
  },
  //导航
  lookNavigation: function(e) {
    // console.log(e)
    var that = this;
    wx.getLocation({
      success: function(res) {
        var city = "",
          desc = "",
          longitude = res.longitude,
          latitude = res.latitude,
          longitude2 = e.currentTarget.dataset.lng, //门店经度
          latitude2 = e.currentTarget.dataset.lat, //门店纬度
          name = "如家酒店"; //门店名称
       // console.log(longitude, latitude, longitude2, latitude2, name)
        wx.navigateTo({
          url: `../map/map?longitude=${longitude}&latitude=${latitude}&longitude2=${longitude2}&latitude2=${latitude2}&city=${city}&name=${name}&desc=${desc}`,
        })
      },
    })
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    // Do something when pull down
  },
  // Event handler.
  viewTap: function() {
    this.setData({
      text: 'Set some data for updating view.'
    })
  }
})