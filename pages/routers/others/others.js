const App = getApp()
var config = require('../../../utils/app/config.js')
var reqAPI = config.defaultURL

Page({
  data: {
    navH: 0,
    admin_view: false,
  },
  idInput: function (e) {
    this.setData({
      admin_id: e.detail.value,
    })
  },
  pwdInput: function (e) {
    this.setData({
      admin_pwd: e.detail.value,
    })
  },
  adminView: function () {
    this.setData({
      admin_view: true,
    })
  },
  cancel: function () {
    wx.hideLoading()
    this.setData({
      admin_view: false,
    })
  },
  adminLogin: function () {
    var that = this
    var id = this.data.admin_id
    var pwd = this.data.admin_pwd
    wx.showLoading()
    if (id && pwd) {
      wx.request({
        url: reqAPI + '/adminlgn',
        data: {
          id: id,
          pwd: pwd,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          if (res.data.status == 'success') {
            wx.hideLoading()
            wx.showToast({
              title: '登录成功',
              duration: 1000,
            })
            that.setData({
              admin_view: false,
            })
            wx.redirectTo({
              url: '/pages/routers/admin/admin',
            })
          } else {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '用户名或密码错误',
              showCancel: false,
              confirmText: '确定'
            })
          }
        }
      })
    } else {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '请填写完整',
        showCancel: false,
        confirmText: '确定'
      })
    }
  },
  onLoad: function () {
    this.setData({
      navH: App.globalData.navH,
    })
  },
})