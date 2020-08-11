// components/navbar/index.js
const App = getApp();

Component({
  properties: {
    pageName: String,
  },
  data: {
  },
  lifetimes: {
    attached: function() {
      this.setData({
        navH: App.globalData.navH
      })
    }
  },
  methods:{
    //回退
    navBack() {
      wx.navigateBack()
    },
    //回主页
    toHome() {
      wx.switchTab({
        url: '/pages/home/home'
      })
    },
  }
})