const App = getApp()
var config = require('../../../utils/app/config.js')
var reqAPI = config.defaultURL

Page({
  data: {
    navH: 0,
    isholiday: false,
    current_festival: '',
  },
  isholidayChange: function(e) {
    this.setData({
      isholiday: e.detail.value
    })
  },
  festivalInput: function(e) {
    this.setData({
      festival: e.detail.value
    })
  },
  save: function() {
    var that = this
    var festival = this.data.festival
    if (this.data.isholiday == true){
      var isholiday = 't'
    } else {
      var isholiday = 'f'
    }
    console.log(isholiday,festival)

    if (this.data.festival == undefined || this.data.festival == '') {
      wx.showModal({
        title: '提示',
        content: '请填写完整',
        showCancel: false,
        confirmText: '确定',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否保存设置',
        showCancel: true,
        confirmText: '确定',
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: reqAPI + '/updateisholiday',
              data: {
                isholiday: isholiday,
                remark: festival,
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function(res) {
                console.log(res.data)
                if (res.data.status == 'success') {
                  wx.showToast({
                    title: '设置成功',
                    duration: 1000,
                  })
                  that.onshow()
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '设置失败',
                    showCancel: false,
                    confirmText: '确定'
                  })
                }
              }
            })
          }
        }
      })
    }
  },
  onShow: function() {
    var that = this

    this.setData({
      navH: App.globalData.navH,
    })

    wx.request({
      url: reqAPI + '/queryisholiday',
      header: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        if (res.data.results.isholiday == 't') {
          that.setData({
            isholiday: true
          })
        }
        if (res.data.results.isholiday == 'f') {
          that.setData({
            isholiday: false
          })
        }
        that.setData({
          current_festival: res.data.results.remark,
        })
      }
    })
  }
})