const App = getApp()
const AppID = "wxb49dd1f338b14d24"
var WXBizDataCrypt = require('../../../utils/cryptojs-master/RdWXBizDataCrypt.js')
var config = require('../../../utils/app/config.js')
var reqAPI = config.defaultURL

Page({
  data: {
    navH: 0,
  },
  onLoad: function() {
    this.setData({
      navH: App.globalData.navH,
    })
  },
  noLogin: function() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  register: function() {
    var that = this
    wx.showLoading()
    wx.login({
      success(res) {
        console.log(res.code)
        wx.request({
          url: reqAPI + '/getoid',
          data: {
            jscode: res.code,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function(res) {
            console.log(res.data)
            var crypto = new WXBizDataCrypt(AppID, res.data.results.session_key)
            wx.getUserInfo({
              success: function(res) {
                var decode_data = crypto.decryptData(res.encryptedData,
                  res.iv)

                wx.request({
                  url: reqAPI + '/tslgn',
                  data: {
                    id: decode_data.openId,
                  },
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  method: 'POST',
                  success: function(res) {
                    wx.hideLoading()
                    if (res.data.status == 'success') {
                      wx.showModal({
                        title: '提示',
                        content: '本微信用户已注册\n请直接登录',
                        showCancel: false,
                      })
                    } else {
                      wx.setStorageSync('openid', decode_data.openId)
                      wx.setStorageSync('unionid', decode_data.unionId)
                      wx.navigateTo({
                        url: '/pages/routers/wellcome/register',
                      })
                    }
                  }
                })
              },
              fail: function() {
                wx.hideLoading()
              }
            })
          },
        })
      }
    })
  },
  login: function() {
    var that = this
    wx.showLoading()
    wx.login({
      success(res) {
        console.log(res.code)
        wx.request({
          url: reqAPI + '/getoid',
          data: {
            jscode: res.code,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function(res) {
            console.log(res.data)
            var crypto = new WXBizDataCrypt(AppID, res.data.results.session_key)
            wx.getUserInfo({
              success: function(res) {
                var decode_data = crypto.decryptData(res.encryptedData,
                  res.iv)

                wx.request({
                  url: reqAPI + '/tslgn',
                  data: {
                    id: decode_data.openId,
                  },
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  method: 'POST',
                  success: function(res) {
                    wx.hideLoading()
                    if (res.data.status == 'success') {
                      wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 1000,
                      })
                      wx.setStorageSync('openid', decode_data.openId)
                      wx.setStorageSync('unionid', decode_data.unionId)
                      wx.reLaunch({
                        url: '/pages/home/home',
                      })
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: '登录失败\n请注册新用户',
                        showCancel: false,
                      })
                    }
                  }
                })
              },
              fail: function() {
                wx.hideLoading()
              }
            })
          }
        })
      }
    })
  },
})