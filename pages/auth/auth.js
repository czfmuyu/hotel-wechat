const app = getApp();
Page({
  data: {
    'imgUrl_logo': app.globalData.imgUrl + 'auth/logo_hotel_HJ_free.jpeg'
  },
  onLoad: function(options) {},
  callback(res) {
    var that=this;
    var userInfo = res.detail.userInfo;
    app.globalData.nickName = userInfo.nickName;
    app.globalData.vatarUrl = userInfo.avatarUrl;
    wx.setStorageSync('scopeUserInfo', true)
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
         // console.log('用户的信息已经得到，即将弹出地理位置授权框');
          //用户位置...
          wx.getLocation({
            success(res) {
              // 获取经纬度保存到本地
             // console.log('地理位置经纬度获取成功.');
             // console.log(res.latitude + ' , ' + res.longitude);
              wx.setStorageSync('lat', res.latitude);
              wx.setStorageSync('lng', res.longitude);
              wx.setStorageSync('scopeUserLocation', true);
              wx.showToast({
                title:'waiting...',
                icon:'loading',
                duration:3000
              });
              //此时调用登录的接口判断是否为新用户,然后去注册手机
              that.loginIn();
            },
            fail(res) {
            //  console.log('用户拒绝获取地理位置，即将打开小程序设置页面。')
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting['scope.userInfo'] && res.authSetting['scope.userLocation']) {
                   // console.log('用户同意获取用户信息和用户地理位置，即将返回入口页');
                    wx.setStorageSync('scopeUserInfo', true);
                    wx.setStorageSync('scopeUserLocation', true);
                    wx.showToast({
                      title:'waiting...',
                      icon:'loading',
                      duration:3000
                    });
                    wx.getLocation({
                      success(res) {
                        wx.setStorageSync('lat', res.latitude)
                        wx.setStorageSync('lng', res.longitude)
                        wx.switchTab({
                          url: '../index/index',
                        })
                      }
                    })
                  }
                }
              })
            }
          })
        } else {
         // console.log('用户拒绝获取用户信息，停留在当前页');
        }
      }
    })
  },
//登录判断
loginIn:function(){
  var that=this;
  wx.request({
    url: app.globalData.devUrl + '/personal/wechatLogin',
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      wechatOpenId: app.globalData.openId
    },
    success: function (res) {
      var data=res.data.data;
      // console.log(res.data.data.id)
      if(data==null){
        //此时data为null则会说明用户是新用户,让其注册手机号;
        wx.showToast({
          title:'waiting...',
          icon:'loading',
          duration:2000
        });
        wx.reLaunch({
          url: '../login/login',
        })
      }else{
        app.globalData.userId = res.data.data.id;
        console.log(app.globalData.userId)
        //否则是的说明老用户,直接去首页1
        wx.showToast({
          title:'跳转...',
          icon:'loading',
          duration:2000
        });
        wx.switchTab({
          url: '../index/index',
        })
      }
    }
  })
}
});