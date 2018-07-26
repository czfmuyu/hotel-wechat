// pages/guestRoomOrder/guestRoomOrder.js 页面的总价钱改变 bug
var timeDate = require("../../utils/date.js");
var Moment = require("../../utils/moment.js");
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear()
var DATE_MONTH = new Date().getMonth() + 1
var DATE_DAY = new Date().getDate()

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _iconArrowBottom: app.globalData.imgUrl+'room/arrow-bottom.png',
    _iconArrowRight: app.globalData.imgUrl+'room/arrow-right.png',
    info: {
      address: '', //(string, optional): 酒店地址 ,
      hotelId: '', //酒店ID
      area: '', // (integer, optional): 面积 ,
      bedType: '', //(string, optional): 房间类型 ,
      creatTime: '', // (string, optional): 订单创建时间 ,
      endTime: '', // (string, optional): 离店 ,
      hotelMobile: '', // (string, optional): 酒店电话 ,
      hotelName: '', //(string, optional): 酒店名称 ,
      lat: 0, // (number, optional): 经度 ,
      lengthOfResidence: '', // (integer, optional): 居住时间 ,
      lng: 0, // (number, optional): 纬度 ,
      numberOfRooms: '1', // (integer, optional): 房间数 ,
      orderCode: '', //(string, optional): 订单号 ,
      orderId: '', //(integer, optional): 订单id ,
      orderState: '', //(integer, optional): 订单状态(0:未付款,1:已付款,等待入住,2:已付款,完成入住-1:取消订单,3-已退款订单) ,
      price: 0, // (number, optional): 单价价格 ,
      roomImg: '', //(string, optional): 客房图片 ,
      roomName: '', // (string, optional): 客房名称 ,
      startTime: '', //(string, optional): 入住 ,
      totalPrice: 0, //(number, optional): 总价 ,
      userMobile: '', //(string, optional): 联系电话 ,
      userNameList: [{name: "",}], //(Array[string], optional): 入住人名称 ,
      window: 0, //(number, optional): 是否有窗
    },
    roomId: '', //房型id
    inputPhoneNum: "", // 联系电话
    payPrice: 0, //付款金额
    checkInDate: '', //开始时间
    checkOutDate: '', // 结束时间
    dateNumber: 1, //入住天数
    casIndex: 0,
    casIndex1: "",
    casArray: ["1", '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    getDate:{},
  },

  /**
  * 生命周期函数--监听页面显示
  */
  // onShow: function () {
  //   // Do something when page show.
  //   let getDate = wx.getStorageSync("ROOM_SOURCE_DATE");
  //   var allPrice = this.data.info.numberOfRooms * this.data.info.price * getDate.dateNumber;
  //   this.setData({
  //     checkInDate: getDate.checkInDate || Moment(new Date()).format('YYYY-MM-DD'),
  //     checkOutDate: getDate.checkOutDate || Moment(new Date()).add(1, 'day').format('YYYY-MM-DD'),
  //     dateNumber: getDate.dateNumber || 1,
  //     payPrice: allPrice, //付款金额
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      roomId: options.roomId
    });
    // 初始化日历
    wx.setStorage({
      key: 'ROOM_SOURCE_DATE',
      data: {
        checkInDate: Moment(new Date()).format('YYYY-MM-DD'),
        checkOutDate: Moment(new Date()).add(1, 'day').format('YYYY-MM-DD'),
        startTime:Moment(new Date()).format('YYYY-MM-DD'),
        endTime: Moment(new Date()).add(1, 'day').format('YYYY-MM-DD'),
      }
    });
    that.getData(options.roomId)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // Do something when page show.
    let getDate = wx.getStorageSync("ROOM_SOURCE_DATE");
    // var allPrice = this.data.info.numberOfRooms * this.data.info.price * getDate.dateNumber;
    // 日历 xx月xx日
    var inDate = getDate.checkInDate;
    var outDate = getDate.checkOutDate;
    this.setData({
      checkInDate: timeDate.checkInDate(inDate),
      checkOutDate: timeDate.checkOutDate(outDate),
      getDate:getDate,
      dateNumber: getDate.dateNumber || 1,
      // payPrice: allPrice, //付款金额
      startTime:inDate,
      endTime: outDate,
    });
    this.getprice();
  },
  getprice(){
    var that = this;
    wx.request({
      url: app.globalData.devUrl + '/order/totalAmount',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        roomId: that.data.roomId,
        startTime:that.data.startTime,
        endTime:that.data.endTime,
        numberOfRooms:that.data.info.numberOfRooms,
      },
      success: function (res) {
        var date = res.data.data;
        if (res.data.code == 1) {
          console.log(date)
          that.setData({
            payPrice: date.totalPrice 
          })
        }
      }
    })
  },

  //页面渲染
  getData(id) {
    // console.log(id)
    var that = this;
    wx.request({
      url: app.globalData.devUrl + '/order/initOrder',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        roomId: id,
      },
      success: function (res) {
        // console.log(res.data, '订单');
        var date = res.data.data;
        if (res.data.code == 1) {
          that.setData({
            info: date,
            // payPrice: date.price
          })
        }
      }
    })
  },

  //房间下拉框和入住人姓名输入框和总钱数的逻辑
  bindCasPickerChange(e) {
    // console.log(e.detail.value)
    // console.log(this.data.info.userNameList.length)
    let that = this;
    var list = that.data.info.userNameList;
    var num = e.detail.value * 1 + 1;

    if (num > that.data.info.userNameList.length) {
      var calculation = e.detail.value - that.data.info.userNameList.length;
      var slist = [];
      for (let index = -1; index < calculation; index++) {
        slist.push({ name: '' });
      }
      list = list.concat(slist)
    } else if (num < that.data.info.userNameList.length) {
      list = list.splice(0, num);
    }

    var allRoom = this.data.casArray[e.detail.value];
    // var allPrice = allRoom * this.data.info.price * this.data.dateNumber;
    var numberOfRooms = "info.numberOfRooms"
    var userNameList = "info.userNameList"
    this.setData({
      // payPrice: allPrice, //付款金额
      casIndex: e.detail.value, // 页面逻辑用
      [numberOfRooms]: this.data.casArray[e.detail.value],  //房间数 
      [userNameList]: list  //入住人列表
    })
    // console.log("所有的价格",allPrice)
    // console.log('房间数', this.data.casArray[e.detail.value])
    // console.log('入住人列表', list)
    //每次房间数量变化都调取总金额接口
    this.getprice();

  },

  //手机号
  bindKeyInput: function (e) {
    // console.log(e)
    if (e.detail.cursor > 11) {
      wx.showToast({
        title: '手机号错误！',
        icon: 'info',
        duration: 1000
      });
    } else {
      this.setData({
        inputPhoneNum: e.detail.value
      })
    }
  },

  //入住人List
  bindNameInput(e) {
    var index = e.currentTarget.dataset.index;
    var name = e.detail.value;
    var src = 'info.userNameList[' + index + '].name';
    // console.log(src);
    // console.log(name)
    this.setData({
      [src]: name
    })
  },

  //提交订单btn
  reserve() {
    var that = this;
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    if (that.data.inputPhoneNum == "" || reg.test(that.data.inputPhoneNum) != true) {
      wx.showModal({
        title: '提示',
        content: '电话不可为空或电话错误！'
      })
    }else{
       
      if (that.ifUserNum() == undefined) {
        that.submitOrder()
      }
    }
  },

  // 判断入住人是否有为空
  ifUserNum() {
    var that = this;
    for (var i = 0; i < that.data.info.userNameList.length; i++) {
      if (that.data.info.userNameList[i].name == "") {
        wx.showModal({
          title: '提示',
          content: "第" + (i + 1) + "位出行人为空！"
        })
        return false;
      }
    }
  },

  //下订单的接口
  submitOrder: function () {
    var that = this;
    //名字转成JSON格式的
    var onumberOfRooms = JSON.stringify(that.data.info.userNameList);
    // console.log(that.data.payPrice,'订单的总金额');
    wx.request({
      url: app.globalData.devUrl + '/order/submitOrder',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        hotelId: that.data.info.hotelId, //酒店的id
        hotelRoomId: that.data.roomId, //客房的id
        userId: app.globalData.userId, //下单人id
        mobile: that.data.inputPhoneNum, // 联系电话
        startTime: that.data.getDate.checkInDate, //入住
        endTime: that.data.getDate.checkOutDate, //离店
        lengthOfResidence: that.data.dateNumber, //居住时间
        payPrice: that.data.payPrice, //付款金额
        numberOfRooms: that.data.info.numberOfRooms, //	房间数
        usernameList: onumberOfRooms, //入住人名称
        price: that.data.info.price, //单价
      },
      success: function (res) {
        // console.log(res)
        if (res.data.code == 1) {
          // console.log('提交成功')
          var orderId = res.data.data.orderId;
          var code = res.data.data.orderCode;
          //提交成功,获取支付的接口下订单
          that.orderPay(orderId)
        }
      }
    })
  },
  //支付 
  orderPay: function (orderId) {
    var that = this;
    wx.request({
      url: app.globalData.devUrl + '/wechatPay/payWechat',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        orderId: orderId,
        wechatOpenId: app.globalData.openId
      },
      success: function (msg) {
        wx.requestPayment({
          'timeStamp': msg.data.data.timeStamp,
          'nonceStr': msg.data.data.nonceStr,
          'package': msg.data.data.package,
          'signType': 'MD5',
          'paySign': msg.data.data.paySign,
          'success': function (res) {
            // console.log("支付成功")
            wx.switchTab({
              url: '../order/order',
            })
          },
          'fail': function (res) {
            var err = res.errMsg;
            if (err == "requestPayment:fail cancel") {
              wx.showToast({
                title: '支付失败',
                icon: "success",
                duration: 1000
              })

              wx.request({
                url: app.globalData.devUrl + '/order/cancellationOfOrder',
                method: 'post',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  orderId: orderId,
                },
                success: function (msg) {
                  console.log(msg)
                }
              })


            }
          }
        })
      }
    })
  },
  //日历
  goPage() {
    wx.navigateTo({
      url: '../calendar/calendar'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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