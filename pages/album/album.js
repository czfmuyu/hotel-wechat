var app = getApp();
var atype=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: '0',
    scrollTop:"0",
    allData:"",
    allMsg:"",
    PicImg:true,
    allPic:"",
    imgSeverUrl: app.globalData.imgUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var otype = 0;
    //加载的时候调用的接口函数
    app.request({
      url: app.globalData.devUrl + '/hotel/searchPhotoAlbum',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        hotelId: 1,
        type: otype
      },
      success: function (res) {
        var allImg = res.data.data;
       // console.log(res.data.data)
        var circumImg = allImg.circumImg;
        var facadeImg = allImg.facadeImg;
        var publicAreaImg = allImg.publicAreaImg;
        var repastImg = allImg.repastImg
        var restsImg = allImg.restsImg;
        var roomImg = allImg.roomImg;
        var arr=[];
        var oarr = arr.concat.apply([], [circumImg, facadeImg, publicAreaImg, restsImg, repastImg,roomImg])//把所有的数组合并成一个数组
        that.setData({
          allPic: oarr,
          allMsg: res.data.data,
          PicImg:true,
        })
      }
    })
  },
  clickChoose: function(e) {
    var that = this;
    var currentTab = e.currentTarget.dataset.tabName;
    that.setData({
      currentTab: currentTab
    })
    that.shopBblum(currentTab);
  },
  //门店的图片接口
  shopBblum: function (otype) {
    var that = this;
   app.request({
      url: app.globalData.devUrl + '/hotel/searchPhotoAlbum',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        hotelId: 1,
        type: otype
      },
      success: function (res) {
       // console.log(res)
        var allImg=res.data.data;
        that.setData({
          PicImg:false,
          allData:allImg
        })
      }
    })
  },
  //获取页面的高度
  onPageScroll:function(e){
    var that=this;
    that.setData({
        scrollTop: e.scrollTop
    })
  },
  //回到顶部
  bindViewStoredetailb: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    })
  },
  //查看所有的图片
  previewAllImg:function(e){
    var that=this;
    var index = e.currentTarget.dataset.index;
    var imgArr = that.data.allPic;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //查看分类图片
  previewImg: function (e) {
    var that=this;
    var index = e.currentTarget.dataset.index;
     atype = e.currentTarget.dataset.id;
    if(atype==1){
      var imgArr = that.data.allData.roomImg;
    } else if (atype == 2){
      var imgArr = that.data.allData.repastImg;
    } else if (atype == 3) {
      var imgArr = that.data.allData.facadeImg;
    } else if (atype == 4) {
      var imgArr = that.data.allData.circumImg;
    } else if (atype == 5) {
      var imgArr = that.data.allData.publicAreaImg;
    } else if (atype == 6) {
      var imgArr = that.data.allData.restsImg;
    }
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
    wx.showToast({
      title: '没有更多了',
      icon: 'info',
      duration: 1000
    });
  }
})