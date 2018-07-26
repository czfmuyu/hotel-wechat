import PromiseFn from '../../utils/httpsPromisify';
const app = getApp();
var INV = null; //倒计时函数...

Page({
  data: {
    _iconPhone: app.globalData.imgUrl+'login/icon-phone@2x-min.png',
    _iconLock: app.globalData.imgUrl+'login/icon-lock@2x-min.png',
    _initialText: '获取验证码',
    _disabled: false,
    _currentTime: 61,
    _phoneVal: null,
    _codeVal: null
  },

  //#加载...
  onLoad: function(options) {
    // wx.setStorageSync('_applogined', false)
    // this.getOpenId();
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},

  //#动态码 点击...
  getDynamicCode() {
    var that = this;
    var pNum = that.data._phoneVal;
   // console.log(pNum);
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(16[0-9]{1}))+\d{8})$/;
    if (pNum == null || pNum.length==0) { // 手机号位数不对...
      wx.showModal({
        title: '提示',
        content: '手机号为空，请正确填写！',
        success: function (res) {
          if (res.confirm) {
          //  console.log('用户点击确定')
          } else if (res.cancel) {
           // console.log('用户点击取消')
          }
        }
      })
    } else if (pNum.length !== 11 || !myreg.test(pNum)) {
      wx.showModal({
        title: '提示',
        content: '手机号格式不对,请正确填写！',
        success: function (res) {
          if (res.confirm) {
          //  console.log('用户点击确定')
          } else if (res.cancel) {
           // console.log('用户点击取消')
          }
        }
      })
    } else {
      //调接口...
      that.codeApi(pNum);
      //倒计时动画...
      that.codeAnimation();
      //设值...
      that.setData({
        _disabled: true
      });
    }

  },

  //调接口...
  codeApi(pNum) {
    var that = this;
    PromiseFn.httpsPromisify(wx.request)({
      url: app.globalData.devUrl + '/personal/getWxVerificationCode',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        mobile: pNum
      }

    }).then(res => {
     // console.log(res);
     // console.log(res.statusCode);
      if (res.statusCode !== 200) {
        wx.showToast({
          title: '获取异常',
          icon: 'loading',
          image: '../../images/caution.png',
          duration: 1000
        });
      } else {
        wx.showToast({
          title: res.data.msg,
          icon:'success',
          duration:1000
        })
      }
    }); //End Promise 
  },

  //#倒计时动画...
  codeAnimation() {
    var that = this;
//console.log('codeAnimation()...');
    var _currentTime = that.data._currentTime;
    INV = setInterval(() => {
      _currentTime--;
      that.setData({
        _initialText: _currentTime + '秒'
      });

      if (_currentTime <= 0) {
        clearInterval(INV);
        that.setData({
          _initialText: '重新发送',
          _currentTime: 61,
          _disabled: false
        });
      }
    }, 1000);
  },

  //#手机号...
  inputPhoneNum(e) {
    var that = this;
    var val = e.detail.value;
    if (val.length > 11) {
      //超出11位...
      wx.showModal({
        title: '提示',
        content: '手机号长度11位',
        success(res) {
          if (res.confirm) {
          //  console.log('用户点击确定')
          }
        }
      });
    } else {
      that.setData({
        _phoneVal: val
      });
    };
  },

  //#动态码...
  inputCode(e) {
    var that = this;
    var val = e.detail.value;
    that.setData({
      _codeVal: val
    });
  },

  //#登陆 bindtap...
  doLogin() {
   // console.log('doLogin()...');
    var that = this;
    setTimeout(() => {
      that.verCode();
    }, 800);
  },
  //验证...
  verCode() {
    var that = this;
  //  console.log('verCode()...');
    var that = this;
    var pNum = that.data._phoneVal;
    var cNum = that.data._codeVal;
    var uName = app.globalData.nickName;
    var uVatarUrl = app.globalData.vatarUrl;
    var uOpenId = app.globalData.openId;
    PromiseFn.httpsPromisify(wx.request)({
      url: app.globalData.devUrl + '/personal/checkVerificationCode',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        userName: uName,
        mobile: pNum,
        portait: uVatarUrl,
        wechatOpenId: uOpenId,
        verificationCode: cNum
      }
    }).then(res => {
      app.globalData.userId=res.data.data.id;
     // console.log(res)
     // console.log("用户的数据以及id")
      if (res.data.code === 1) {
        wx.showToast({
          title: res.data.msg,
          icon:"success" ,
         duration:1000
        });

    //调登陆接口...
   //console.log('调登陆接口...');
    // wx.navigateTo({
		// 	url: '../dataSelect/dataSelect'　　// 跳房间详情页面
		// })

        //验证码通过跳 首页...
        wx.switchTab({
          url: '../index/index'
        });
        wx.setStorageSync('_applogined', true);
       // console.log('after wx.navigateTo();');
      } else { //验证失败...
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        });
      }
    }); //End Promise 
  }
}); 