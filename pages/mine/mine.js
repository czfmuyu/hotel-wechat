import PromiseFn from '../../utils/httpsPromisify';
const app = getApp();
Page({
  data: {
    _nickName: '' || '请登录',
    _vatarUrl: '' || app.globalData.imgUrl+'auth/logo_hotel_HJ_free.jpeg',
    _iconOrder: app.globalData.imgUrl+'order_active@2x.png',
    _iconCustomer: app.globalData.imgUrl+'mine/customer.png',
    _iconArroR: app.globalData.imgUrl+'mine/my-arrow-right.png'
  },

  //#加载...
  onLoad: function(options) {
    this.renderUserInfo();
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },

  //#用户...
  renderUserInfo() {
    this.setData({
      _nickName: app.globalData.nickName,
      _vatarUrl: app.globalData.vatarUrl
    });
  },
  //#跳转 我的订单’...
  goOrderPage() {
    var that = this;
    //console.log("00000")
    if(app.globalData.userId){
      wx.switchTab({
        url: '../order/order',
      })
    }else{
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
  },
  //#联系客服...
  doCall() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phone,
    })
  }
}); 