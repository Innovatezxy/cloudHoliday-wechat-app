const App = getApp()

Page({
  data: {
    navH: 0,
    user_agreement: false,
    privacy: false,
  },
  onLoad: function(options) {
    this.setData({
      navH: App.globalData.navH,
    })
    if (options.user_agreement == 'true') {
      this.setData({
        user_agreement: true,
      })
    }
    if (options.privacy == 'true') {
      this.setData({
        privacy: true,
      })
    }
  },
})