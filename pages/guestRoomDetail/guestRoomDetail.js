// pages/guestRoomDetail/guestRoomDetail.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    interval: 3000,
    roomId:'',
    info:{
        area:0,// (integer, optional): 面积 ,
        bathroom:"",// (string, optional): 卫浴 ,
        bedType:"",// (string, optional): 床型 ,
        breakfast:"",// (string, optional): 早餐 ,
        floor:"",// (string, optional): 楼层 ,
        galleryful:0,// (integer, optional): 入住人数 ,
        internet:"",// (string, optional): 上网 ,
        price:0,// (number, optional): 价格 ,
        roomBeds:[],// (Array[RoomBedResponse], optional): 房间床型 ,
        roomId:'',// (integer, optional): 客房id ,
        roomImgs:[],// (string, optional): 客房照片 ,
        roomName:"",// (string, optional): 客房名字 ,
        roomState:false,// (boolean, optional): 房间状态 ,
        window:1,// (integer, optional): 是否有窗:(0-无窗,1-有窗,2-部分有窗)
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var roomId = options.roomId;
    this.getData(roomId);
    var that = this;
    that.setData({
      roomId: options.roomId
    })
    // this.getData(options);
  },

  //拉去房型信息
  getData: function (roomId) {
    var that = this;
    wx.request({
      url: app.globalData.devUrl + '/hotel/searchHotelRoom',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        roomId: roomId,
      },
      success: function(res) {
       // console.log(res.data);
      //  console.log(res,'房间详情');
        var date = res.data.data;
        if (res.data.code == 1) {
          that.setData({
            // haveorder: false
            info:{
              area:date.area,//面积 ,
              bathroom:date.bathroom,// (string, optional): 卫浴 ,
              bedType:date.bedType,// (string, optional): 床型 ,
              breakfast:date.breakfast,// (string, optional): 早餐 ,
              floor:date.floor,// (string, optional): 楼层 ,
              galleryful:date.galleryful,// (integer, optional): 入住人数 ,
              internet:date.internet,// (string, optional): 上网 ,
              price:date.price,// (number, optional): 价格 ,
              roomBeds:date.roomBeds,// (Array[RoomBedResponse], optional): 房间床型 ,
              roomId:date.roomId,// (integer, optional): 客房id ,
              roomImgs:date.roomImgs,// (string, optional): 客房照片 ,
              roomName:date.roomName,// (string, optional): 客房名字 ,
              roomState:date.roomState,// (boolean, optional): 房间状态 ,
              window:date.window,// (integer, optional): 是否有窗:(0-无窗,1-有窗,2-部分有窗)
            }
          })
        }
      }
    })
  },

  //预览图片
  seeImg(val){
    // console.log(val.currentTarget.dataset,'图片')
    wx.previewImage({
      current: val.currentTarget.dataset.img, // 当前显示图片的http链接
      urls: val.currentTarget.dataset.list // 需要预览的图片http链接列表
    }) 
  },

  //预定
  reserve(e) {
    // console.log(e,'预定')
    if (app.globalData.userId) {
      wx.navigateTo({
        url: '../guestRoomOrder/guestRoomOrder?roomId=' + e.currentTarget.id   　// 跳订单详情页面
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否去登录？',
        confirmText: '去登录',
        cancelText: '暂不',
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})