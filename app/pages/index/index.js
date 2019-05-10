//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '我的音乐列表',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userID: 0,
  },
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.login();
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.login();
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          this.login();
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    // console.log(e.detail);
    if (e.detail.rawData) {
      this.login();
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
      wx.showToast({
        title: '请登录，后进入。',
        icon: 'none',
        duration: 2000
      })
    }
  },
  login: function(e) {
    var self = this;

    wx.showLoading({
      title: '加载扫描目录中...',
      mask: true,
    })

    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: app.config.apiUrl + '/login',
            data: {
              code: res.code,
              info: app.globalData.userInfo,
            },
            success(res) {
              wx.hideLoading()
              console.log(res);
              // 返回uid进行设置
              if (res.data.status) {
                self.setData({
                  userID: res.data.data.uid,
                })
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

  },
  getList: function(){
    wx.navigateTo({
      url: '/pages/list/index?uid=' + this.data.userID
    })
  }
})
