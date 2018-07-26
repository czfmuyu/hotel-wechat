import PromiseFn from '../../utils/httpsPromisify';
var timeDate = require("../../utils/date.js");
var Moment = require("../../utils/moment.js");
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear()
var DATE_MONTH = new Date().getMonth() + 1
var DATE_DAY = new Date().getDate()
let amap = require("../../libs/amap");
const app = getApp();
Page({
  data: {
    '_showLoading': true,
    '_announceList': [],
    imgUrl_location: app.globalData.imgUrl+'index/icon-location@2x.png',
    imgUrl_location_arro: app.globalData.imgUrl+'index/icon-location-arro@2x.png',
    imgUrl_free: app.globalData.imgUrl+'index/icon-free@2x.png',
    imgUrl_park: app.globalData.imgUrl+'index/icon-park@2x.png',
    imgUrl_biz: app.globalData.imgUrl+'index/icon-biz@2x.png',
    imgUrl_wifi: app.globalData.imgUrl+'index/icon-wifi@2x.png',
    imgUrl_announce: app.globalData.imgUrl+'index/icon-announce@2x.png',
    imgUrl_tel: app.globalData.imgUrl+'index/icon-tel@2x.png',
    '_hotelInfo': {}, //酒店信息...
    '_glongHotelRoomList': [], //房间列表...
    imgUrls_swiper: [
      'https://picsum.photos/710/248?image=1071',
      'https://picsum.photos/710/248?image=1061',
      'https://picsum.photos/710/248?image=1071'
    ],
    //action: 1:查看 2:浏览
    //product: 1: 酒店信息 2: 房间照片 
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    msgMockData: [
      {count: 0,action: 1,product: 1},
      {count: 0,action: 1,product: 2}, 
      {count: 0,action: 2,product: 1}, 
      {count: 0,action: 2,product: 2},
      {count: 0,action: 1,product: 2}, 
      {count: 0,action: 2,product: 2}, 
      {count: 0,action: 1,product: 1},
      {count: 0,action: 1,product: 1},
      {count: 0,action: 1,product: 2},
      {count: 0,action: 1,product: 1},
      {count: 0,action: 2,product: 2},
      {count: 0,action: 1,product: 1},
      {count: 0,action: 2,product: 2},
      {count: 0,action: 2,product: 2},
      {count: 0,action: 1,product: 1},
      {count: 0,action: 2,product: 2},
      {count: 0,action: 1,product: 1},
      {count: 0,action: 2,product: 2},
      {count: 0,action: 1,product: 1},
      {count: 0,action: 1,product: 2},
      {count: 0,action: 2,product: 1}
    ],
    msgArr: [],
    checkInDate: "",
    checkOutDate: "",
    dateNumber: 1,
    distance: 0, //驾车距离
    stright: 0, // 直线距离 
    time: 0 , // 所用时长
    startDate:'',//开始时间
    endDate:''//结束时间
  },

  //#加载...
  onLoad: function (options) {
    var that = this;

    // 初始化日历
    wx.setStorage({
      key: 'ROOM_SOURCE_DATE',
      data: {
        checkInDate: Moment(new Date()).format('YYYY-MM-DD'),
        checkOutDate: Moment(new Date()).add(1, 'day').format('YYYY-MM-DD')
      }
    });

    //滑动消息...
    that.msgFn();
    //显示头部loading...
    wx.showNavigationBarLoading();
  },
  onReady: function () {},

  onShow: function () {
    wx.showLoading({title: 'waiting...'})
    var that = this;
    that.data.msgArr.length = 0;
    

    //#接收日历数据
    let getDate = wx.getStorageSync("ROOM_SOURCE_DATE");
    var inDate = getDate.checkInDate;
    var outDate = getDate.checkOutDate;
    // console.log(timeDate.checkInDate(inDate),'入住')
    // console.log(timeDate.checkOutDate(outDate),'离开')
    this.setData({
      checkInDate: timeDate.checkInDate(inDate),
      checkOutDate: timeDate.checkOutDate(outDate),
      dateNumber: getDate.dateNumber || 1,
      startDate:inDate,//开始时间
      endDate:outDate//结束时间
    });
    that.renderPage();
  },

  
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {
    this.renderPage();
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    wx.showToast({
      title: '没有更多了',
      icon: 'info',
      duration: 1000
    });
  },

  //滚动信息
  msgFn: function() {
    var n = 0; //每次请求的条数
    var num = Math.floor(Math.random() * 1000); //顾客起点基数
    var grow_scope = 5;
    var arr = [];
    var _this = this;
    _this.data.msgArr.length = 0; //清空数组
    var ITV = setInterval(function() {
      num += Math.floor(Math.random() * grow_scope); //在grow_scope内随机增长
      _this.data.msgMockData[n].count = num;
      arr.push(_this.data.msgMockData[n]);
      ++n;
      if (n == _this.data.msgMockData.length) {
        //console.log('请求数据');
        clearInterval(ITV);
      }
      //设值...
      _this.setData({
        msgArr: arr
      });
      // console.log(_this.data.msgArr); 
      //清空数组...
      _this.data.msgArr.length = 0;
 
    }, 10000);
  },

  //#渲染页...
  renderPage() {
    var that = this;
    //接口...
    PromiseFn.httpsPromisify(wx.request)({
      url: app.globalData.devUrl + '/hotel/searchHomePage',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        startDate:that.data.startDate,//开始时间
        endDate:that.data.endDate//结束时间
      },
    }).then(res => {
      // console.log(res,'初始化页面');
      if (res.statusCode === 200) {
        if (res.data.code === 1) {
          var _tmp = [];
          var _announceData = res.data.data.hotelInfo.announcement;
          _tmp = _announceData.split(" ");
          //设置...
          var lng = res.data.data.hotelInfo.lng,
            lat = res.data.data.hotelInfo.lat;
          that.setData({
            imgUrls_swiper: res.data.data.carouselList,
            _hotelInfo: res.data.data.hotelInfo,
            _glongHotelRoomList: res.data.data.glongHotelRoomList,
            _announceList: _tmp,
            _mobile: res.data.data.hotelInfo.mobile,
            lng: res.data.data.hotelInfo.lng,
            lat: res.data.data.hotelInfo.lat
          });
          wx.hideLoading();
          app.getPos(res.data.data.hotelInfo.lat,res.data.data.hotelInfo.lng); //获取位置信息

          setTimeout(function () {
            //要延时执行的代码
            // console.log(app.globalData.stright)
            // console.log(app.globalData.distance)
            // console.log(app.globalData.time)
            that.setData({
              stright: app.globalData.stright, //驾车距离
              distance: app.globalData.distance, // 直线距离 
              time: app.globalData.time  //所用时长
            })
          }, 1000) //延迟时间 这里是1秒
          
        }
      } else {
        //请求错误...
        wx.showModal({
          title:'提示',
          content:'请求错误!',
          showCancel:false
        });
      }
    }); //End Promise 
  },

  //#打电话...
  doCall() {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data._mobile,
      success: function () {
        // console.log("成功拨打电话")
      }
    });
  },
  //查看详情
  lookMore() {
    wx.navigateTo({
      url: '../hoteldetail/hoteldetail',
    })
  },
  imageLoad(e) {
    var that = this;
    var width = e.detail.width;
    if (width && width !== 0) {
      that.setData({
        _showLoading: false
      });

      wx.hideNavigationBarLoading();
    }
  },
  //导航
  lookNavigation: function (e) {
    var that = this;
    wx.getLocation({
      success: function (res) {
        var city = "",
          desc = "",
          longitude = res.longitude,
          latitude = res.latitude,
          longitude2 = that.data.lng, //门店经度
          latitude2 = that.data.lat, //门店纬度
          name = "如家酒店"; //门店名称
        //console.log(longitude, latitude, longitude2, latitude2, name)
        wx.navigateTo({
          url: `../map/map?longitude=${longitude}&latitude=${latitude}&longitude2=${longitude2}&latitude2=${latitude2}&city=${city}&name=${name}&desc=${desc}`,
        })
      },
    })
  },
  //#预定...
  doReserve(e) {
    // console.log(e);
    var nPrice = e.currentTarget.dataset.price;
    var roomId = e.currentTarget.dataset.roomid;
    //  console.log('价格是：' + nPrice);
    //  console.log('ID是：' + roomId);
    if (app.globalData.userId) {
      wx.navigateTo({
        url: '../guestRoomOrder/guestRoomOrder?roomId=' + roomId,
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
          }
        }
      })
    }

  },

  //#查看房间详情...
  checkRoomDetail(e) {
    //console.log('checkRoomDetail()...');
    var nRId = e.currentTarget.dataset.roomid;
    //console.log('房间ID是：' + nRId);
    wx.navigateTo({
      url: '../guestRoomDetail/guestRoomDetail?roomId=' + nRId,
    })
  },

  //# 跳相册...
  goAlbum() {
    wx.navigateTo({
      url: '../album/album',
    })
  },
  // 跳日历
  goDate: function () {
    wx.navigateTo({
      url: '../calendar/calendar'
    })
  }
})
