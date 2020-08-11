const App = getApp()
var util = require('../../utils/util.js')
var config = require('../../utils/app/config.js')
var reqAPI = config.defaultURL

Page({
  data: {
    navH: 0,
    name: '---',
    type: 's',
    s_number: 0,
    b_number: 0,
    r_number: 0,
    l_number: 0,
    s_access_number: 0,
    b_access_number: 0,
    l_access_number: 0,
    l_current_number: 0,
    b_current_number: 0,
    s_current_number: 0,
    open: false,
  },
  onShow: function() {
    var that = this
    var openid = wx.getStorageSync('openid')

    this.setData({
      navH: App.globalData.navH,
      name: App.globalData.name,
      type: App.globalData.type,
    })

    if(openid){
      wx.request({
        url: reqAPI + '/queryask',
        data: {
          id: openid,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          wx.hideLoading()
          console.log(res.data)
          var s_number = 0
          var b_number = 0
          var r_number = 0
          var l_number = 0
          var s_access_number = 0
          var b_access_number = 0
          var l_access_number = 0
          var l_current_number = 0
          var b_current_number = 0
          var s_current_number = 0
          for (var i = 0; i < res.data.number; i++) {
            res.data.results[i]['start'] = util.formatTimestamp(res.data.results[i].start)
            res.data.results[i]['end'] = util.formatTimestamp(res.data.results[i].end)
            res.data.results[i]['create_time'] = util.formatTimestamps(res.data.results[i].id.slice(0, 10))
          }
          for (var i = 0; i < res.data.number; i++) {
            s_number++
            if (res.data.results[i].b_result == 'none') {
              s_current_number++
            }
            if (res.data.results[i].b_result == 'yes') {
              s_access_number++
            }
          }
          for (var i = 0; i < res.data.number; i++) {
            b_number++
            if (res.data.results[i].b_result == 'none') {
              b_current_number++
            }
            if (res.data.results[i].b_result != 'none') {
              b_access_number++
            }
          }
          for (var i = 0; i < res.data.number; i++) {
            if (res.data.results[i].b_result == 'yes' && res.data.results[i].type == 'c') {
              r_number++
            }
          }
          for (var i = 0; i < res.data.number; i++) {
            if(res.data.results[i].l_name != 'none') {
              l_number++
              if (res.data.results[i].l_result == 'none') {
                l_current_number++
              }
              if (res.data.results[i].l_result != 'none') {
                l_access_number++
              }
            }
          }

          wx.request({
            url: reqAPI + '/queryaskh',
            data: {
              id: openid,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
              console.log(res.data)
              for (var i = 0; i < res.data.number; i++) {
                s_number++
                if (res.data.results[i].b_result == 'none') {
                  s_current_number++
                }
                if (res.data.results[i].b_result == 'yes') {
                  s_access_number++
                }
              }

              that.setData({
                s_number: s_number,
                b_number: b_number,
                l_number: l_number,
                r_number: r_number,
                s_access_number: s_access_number,
                b_access_number: b_access_number,
                l_access_number: l_access_number,
                b_current_number: b_current_number,
                s_current_number: s_current_number,
                l_current_number: l_current_number,
              })
            }
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请确认登录或检查网络',
        showCancel: false,
        confirmText: '确定'
      })
    }
  },
  clear: function() {
    wx.showModal({
      title: 'Warning',
      content: 'You will clear storage on this device',
      success: function(res){
        if(res.confirm){
          wx.clearStorage()
        }
      }
    })
  }
})