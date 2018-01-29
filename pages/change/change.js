//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    acCode: "",
    openid: "",
    url: app.globalData.bathPath
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // 登录
    var that = this;
    var userInfo = this.data.userInfo
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var NICKNAME = userInfo.nickName;
          var GENDER = userInfo.gender == 1 ? "男" : "女";
          var ADDRESS = userInfo.province + userInfo.city + userInfo.country;
          var AVATARURL = userInfo.avatarUrl;
          //发起网络请求
          wx.request({
            url: app.globalData.bathPath + '/miniApp/onLogin',
            data: {
              code: res.code,
              NICKNAME: NICKNAME,
              GENDER: GENDER,
              ADDRESS: ADDRESS,
              AVATARURL: AVATARURL,
            },
            method: 'POST',
            success: function (res) {
              if (res.data == "0") {
                return;
              }
              var openid = res.data.openid;
              that.setData({
                openid: openid
              })
            },
            fail: function (res) {

            },
            complete: function (res) {

            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
