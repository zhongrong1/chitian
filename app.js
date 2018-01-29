//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


    // 获取用户信息
    wx.getSetting({
      success: res => {
        var that = this
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              var userInfo = res.userInfo;
              // 登录
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
                      url: this.globalData.bathPath + '/miniApp/onLogin',
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
                        that.globalData.openid = openid;
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
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    bathPath: "http:127.0.0.1:8080",
    openid: ""
  }
})