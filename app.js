//app.js
import { getRoute } from "./libs/amap.js";
let requestCount = 0
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: this.globalData.devUrl + '/wechatPay/getOpenId',
          method: "post",
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            // console.log(res.data.data.openid)
            that.globalData.openId = res.data.data.openid;
            wx.setStorageSync('openId', res.data.data.openid)
            that.auth()
          }
        })
      }
    })
  },
  //#auth...
  auth() {
    const that = this;
    wx.getSetting({
      success: res => {
        //  console.log('用户授权情况: ' + JSON.stringify(res.authSetting))
        if (res.authSetting['scope.userInfo'] && res.authSetting['scope.userLocation']) {
          wx.setStorageSync('scopeUserInfo', true)
          wx.setStorageSync('scopeUserLocation', true)
          //微信原生接口...
          wx.getUserInfo({
            success: res => {
              //console.log(res)
              that.globalData.userInfo = res.userInfo;
              that.globalData.nickName = res.userInfo.nickName;
              that.globalData.vatarUrl = res.userInfo.avatarUrl;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              that.loginIn()
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              };
            }
          });
        } else { //res.authSetting ==={}时...
          that.goAuth();
        }
      }
    })
  },

  //#goAuth...
  goAuth() {
    wx.navigateTo({
      url: '../auth/auth'
    })
  },
  //登录判断
  loginIn: function () {
    var that = this;
    wx.request({
      url: that.globalData.devUrl + '/personal/wechatLogin',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        wechatOpenId: that.globalData.openId
      },
      success: function (res) {
        //  console.log(res);
        that.globalData.userId = res.data.data.id;
        //  console.log("登录成功")
        //  console.log(res.data.data.id)
      }
    })
  },
  request(args) {
    if (!requestCount) {
      wx.showLoading({
        title: '正在加载中...',
        mask: true
      })
    }
    requestCount++
    return wx.request({
      complete(res) {
        --requestCount
        if (!requestCount) {
          wx.hideLoading()
        }
      },
      ...args
    })
  },

  getPos(lat,lng) {
    var that = this;
    //位置
    wx.getLocation({
      success: function (res) {
        var longitude = res.longitude,
          latitude = res.latitude;
        var radLat1 = lat * Math.PI / 180;
        var radLat2 = latitude * Math.PI / 180;
        var a = radLat1 - radLat2;
        var b = (lng * Math.PI / 180) - (longitude * Math.PI / 180);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;
        s = Math.round(s * 10000) / 10000;
        var stright = s.toFixed(2);

        var type = "getDrivingRoute";
        var city = "";
        var origin = `${longitude},${latitude}`;
        var destination = `${lng},${lat}`;
        getRoute(origin, destination, type, city)
          .then(d => {
            //  console.log(d);
            var distance = d.paths[0].distance;
            var time = d.paths[0].duration;
            var odistance = (distance / 1000).toFixed(2);
            var otiem = (time / 60).toFixed(0)
            that.globalData.stright = stright;
            that.globalData.distance = odistance;
            that.globalData.time = otiem;
            // console.log('我是全局函数')
            // console.log(that.globalData.stright)
            // console.log(that.globalData.distance)
            // console.log(that.globalData.time)
          })
          .catch(e => {
            // console.log(e);
          })
      },

    })
  },

  //全局数据...
  globalData: {
    devUrl: 'https://hotel.1chex.com/api', //酒店小程序
    // devUrl: 'http://121.40.148.153:8081/api', //测试
    imgUrl: 'http://118.25.190.214/res/wechatimg/',
    // imgUrl: '../../images/order', //不同的用不同路径,开发之后统一上传
    code: null,
    openId: null,
    sessionKey: null,
    userId: null,
    userInfo: null,
    nickName: "",
    vatarUrl: "",
    scopeUserInfo: false,
    scopeUserLocation: false,
    phone: '021-68661988',
    stright: "",
    distance: "",
    time: ""
  }
})