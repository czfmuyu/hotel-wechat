var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.globalData.imgUrl,
    orderDetail: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //console.log(options)
    var ordercode = options.orderCode;
    app.request({
      url: app.globalData.devUrl + '/order/searchOrderInfo',
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        orderCode: ordercode
      },
      success: function(res) {
       // console.log(res)
        that.setData({
          orderDetail: res.data.data
        })
      }
    })
  },
  //删除订单
  detalOrder: function(e) {
  //  console.log(e)
    var orderCode = e.currentTarget.dataset.ordercode;
    app.request({
      url: app.globalData.devUrl + '/order/deleteOrder',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        orderCode: orderCode
      },
      success: function(res) {
       // console.log(res)
        if (res.data.code == 1) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1000
          })
          wx.switchTab({
            url: '../order/order',
          })
        }
      }
    })
  },
  //打电话
  phoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phone,
    })
  },
  //导航
  lookNavigation: function(e) {
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})