const App = getApp()

Page({
  data: {
    navH: 0,
  },
  onLoad: function () {
    this.setData({
      navH: App.globalData.navH,
    })
  }
})