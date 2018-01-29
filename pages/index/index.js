//index.js
Page({
  data: { // 参与页面渲染的数据
  },
  onShow:function(){
    setTimeout(function () {
      wx.navigateTo({
        url: '/pages/change/change'
      })
    }, 2000)
  },
  redirect:function(){
    wx.navigateTo({
      url: '/pages/change/change',
    })
    
  }
})