const App = getApp()
var util = require('../../../utils/util.js')
var config = require('../../../utils/app/config.js')
var reqAPI = config.defaultURL

Page({
  data: {
    navH: 0,
    type: '',
    holiday_type: '',
    ing_length: 0,
    lengthAll: 0,
    onekeyInfo: '',
    asktypeIndex: 0,
    open: false,
    refuse_view: false,
    asktypePick: ['假期类型▾', '✪暑假', '✪寒假', '✪元宵节', '✪清明节', '✪劳动节', '✪端午节', '✪中秋节', '✪国庆节'],
    restypeIndex: 0,
    restypePick: ['请假结果▾', '✪待审批', '✪已同意', '✪已拒绝'],
    restypeValue: [undefined, 'ing', 'yes', 'no'],
  },
  asktypePicker: function(e) {
    var that = this
    var ing_length = 0
    var onekeyInfo = []
    var openid = wx.getStorageSync('openid')
    var asktype = e.detail.value

    this.setData({
      restypeIndex: 0,
      asktypeIndex: e.detail.value,
    })

    if (openid) {
      wx.request({
        url: reqAPI + '/queryaskh',
        data: {
          id: openid,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          console.log(res.data)
          for (var i = 0; i < res.data.number; i++) {
            res.data.results[i]['start'] = util.formatTimestamp(res.data.results[i].start)
            res.data.results[i]['end'] = util.formatTimestamp(res.data.results[i].end)
            res.data.results[i]['create_time'] = util.formatTimestamps(res.data.results[i].id.slice(0, 10))
          }

          if (asktype == 0) {
            that.onShow()
          }
          if (asktype == 1) {
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].type == '暑假') {
                onekeyInfo.push(res.data.results[i])
                if (res.data.results[i].b_result == 'none') {
                  ing_length++
                }
              }
            }
            that.setData({
              holiday_type: '暑假',
            })
          }
          if (asktype == 2) {
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].type == '寒假') {
                onekeyInfo.push(res.data.results[i])
                if (res.data.results[i].b_result == 'none') {
                  ing_length++
                }
              }
            }
            that.setData({
              holiday_type: '寒假',
            })
          }
          if (asktype == 3) {
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].type == '元宵节') {
                onekeyInfo.push(res.data.results[i])
                if (res.data.results[i].b_result == 'none') {
                  ing_length++
                }
              }
            }
            that.setData({
              holiday_type: '元宵节',
            })
          }
          if (asktype == 4) {
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].type == '清明节') {
                onekeyInfo.push(res.data.results[i])
                if (res.data.results[i].b_result == 'none') {
                  ing_length++
                }
              }
            }
            that.setData({
              holiday_type: '清明节',
            })
          }
          if (asktype == 5) {
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].type == '劳动节') {
                onekeyInfo.push(res.data.results[i])
                if (res.data.results[i].b_result == 'none') {
                  ing_length++
                }
              }
            }
            that.setData({
              holiday_type: '劳动节',
            })
          }
          if (asktype == 6) {
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].type == '端午节') {
                onekeyInfo.push(res.data.results[i])
                if (res.data.results[i].b_result == 'none') {
                  ing_length++
                }
              }
            }
            that.setData({
              holiday_type: '端午节',
            })
          }
          if (asktype == 7) {
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].type == '中秋节') {
                onekeyInfo.push(res.data.results[i])
                if (res.data.results[i].b_result == 'none') {
                  ing_length++
                }
              }
            }
            that.setData({
              holiday_type: '中秋节',
            })
          }
          if (asktype == 8) {
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].type == '国庆节') {
                onekeyInfo.push(res.data.results[i])
                if (res.data.results[i].b_result == 'none') {
                  ing_length++
                }
              }
            }
            that.setData({
              holiday_type: '国庆节',
            })
          }

          that.setData({
            onekeyInfo: onekeyInfo.reverse(),
            lengthAll: onekeyInfo.length,
            ing_length: ing_length,
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请检查网络',
        showCancel: false,
        confirmText: '确定'
      })
    }
  },
  restypePicker: function(e) {
    var that = this
    var ing_length = 0
    var onekeyInfo = []
    var openid = wx.getStorageSync('openid')
    var restype = e.detail.value

    this.setData({
      asktypeIndex: 0,
      restypeIndex: e.detail.value,
    })

    if (openid) {
      wx.request({
        url: reqAPI + '/queryaskh',
        data: {
          id: openid,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          console.log(res.data)
          for (var i = 0; i < res.data.number; i++) {
            res.data.results[i]['start'] = util.formatTimestamp(res.data.results[i].start)
            res.data.results[i]['end'] = util.formatTimestamp(res.data.results[i].end)
            res.data.results[i]['create_time'] = util.formatTimestamps(res.data.results[i].id.slice(0, 10))
          }

          if (restype == 0) {
            that.onShow()
          }
          if (restype == 1) {
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].b_result == 'none') {
                onekeyInfo.push(res.data.results[i])
                if (res.data.results[i].b_result == 'none') {
                  ing_length++
                }
              }
            }
          }
          if (restype == 2) {
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].b_result == 'yes') {
                onekeyInfo.push(res.data.results[i])
                if (res.data.results[i].b_result == 'none') {
                  ing_length++
                }
              }
            }
          }
          if (restype == 3) {
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].b_result == 'no') {
                onekeyInfo.push(res.data.results[i])
                if (res.data.results[i].b_result == 'none') {
                  ing_length++
                }
              }
            }
          }

          that.setData({
            onekeyInfo: onekeyInfo.reverse(),
            lengthAll: onekeyInfo.length,
            ing_length: ing_length,
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请检查网络',
        showCancel: false,
        confirmText: '确定'
      })
    }
  },
  open: function() {
    this.setData({
      open: true,
    })
  },
  close: function() {
    this.setData({
      open: false,
    })
  },
  contactS: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  refuse: function(e) {
    var id = e.currentTarget.dataset.id

    this.setData({
      refuse_view: true,
      refuse_id: id,
    })
  },
  refuseInput: function(e) {
    this.setData({
      refuse_reason: e.detail.value,
    })
  },
  extraCancel: function() {
    this.setData({
      refuse_view: false,
    })
  },
  approve: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id

    wx.showModal({
      title: '提示',
      content: '是否批准\n批准后不可恢复',
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: reqAPI + '/approveh',
            data: {
              id: id,
              b_result: 'yes',
              b_refuse_reason: 'none',
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function(res) {
              console.log(res.data.results)
              if (res.data.status == 'success') {
                wx.hideLoading()
                wx.showToast({
                  title: '审批成功',
                  duration: 1000.
                })
                that.onShow()
              } else {
                wx.hideLoading()
                wx.showModal({
                  title: '提示',
                  content: '审批失败\n请检查网络',
                  showCancel: false,
                })
              }
            }
          })
        }
      }
    })
  },
  refuseConfirm: function() {
    var that = this
    var refuse_id = this.data.refuse_id
    var refuse_reason = this.data.refuse_reason

    if (this.data.refuse_reason == undefined || this.data.refuse_reason == '') {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '请填写拒绝原因',
        showCancel: false,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否拒绝\n拒绝后不可恢复',
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: reqAPI + '/approveh',
              data: {
                id: refuse_id,
                b_result: 'no',
                b_refuse_reason: refuse_reason,
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function (res) {
                console.log(res.data.results)
                if (res.data.status == 'success') {
                  wx.hideLoading()
                  wx.showToast({
                    title: '审批成功',
                    duration: 1000.
                  })
                  that.setData({
                    refuse_view: false,
                  })
                  that.onShow()
                } else {
                  wx.hideLoading()
                  that.setData({
                    refuse_view: false,
                  })
                  wx.showModal({
                    title: '提示',
                    content: '审批失败\n请检查网络',
                    showCancel: false,
                  })
                }
              }
            })
          }
        }
      })
    }
  },
  onekeyApprove: function() {
    var that = this
    var type = this.data.holiday_type
    var openid = wx.getStorageSync('openid')

    if(this.data.ing_length == 0){
      wx.showModal({
        title: '提示',
        content: '当前没有需要审批的假期去向单',
        showCancel: false,
        confirmText: '确定'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否批准\n批准后不可恢复',
        showCancel: true,
        success: function (res) {
          if(res.confirm){
            if (openid && type) {
              wx.request({
                url: reqAPI + '/onekeyapprove',
                data: {
                  type: type,
                  b_openid: openid,
                  b_result: 'yes',
                  b_refuse_reason: 'none',
                },
                header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                success: function (res) {
                  console.log(res.data)
                  if (res.data.status == 'success') {
                    wx.hideLoading()
                    wx.showToast({
                      title: '审批成功',
                      duration: 1000.
                    })
                    that.onShow()
                  } else {
                    wx.hideLoading()
                    wx.showModal({
                      title: '提示',
                      content: '审批失败\n请检查网络',
                      showCancel: false,
                    })
                  }
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '请检查网络',
                showCancel: false,
                confirmText: '确定'
              })
            }
          }
        }
      })
    }
  },
  onShow: function() {
    var that = this
    var ing_length = 0
    var onekeyInfo = []
    var openid = wx.getStorageSync('openid')

    this.setData({
      navH: App.globalData.navH,
      type: App.globalData.type,
    })

    if (openid) {
      wx.request({
        url: reqAPI + '/queryaskh',
        data: {
          id: openid,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          console.log(res.data)
          for (var i = 0; i < res.data.number; i++) {
            res.data.results[i]['start'] = util.formatTimestamp(res.data.results[i].start)
            res.data.results[i]['end'] = util.formatTimestamp(res.data.results[i].end)
            res.data.results[i]['create_time'] = util.formatTimestamps(res.data.results[i].id.slice(0, 10))
          }
          for (var i = 0; i < res.data.number; i++) {
            onekeyInfo.push(res.data.results[i])
          }
          for (var i = 0; i < res.data.number; i++) {
            if (res.data.results[i].b_result == 'none') {
              ing_length++
            }
          }

          that.setData({
            onekeyInfo: onekeyInfo.reverse(),
            lengthAll: onekeyInfo.length,
            ing_length: ing_length,
          })
        }
      })

      wx.request({
        url: reqAPI + '/queryisholiday',
        header: {
          'Content-Type': 'application/json'
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data.results.remark)
          that.setData({
            holiday_type: res.data.results.remark
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请检查网络',
        showCancel: false,
        confirmText: '确定'
      })
    }
  }
})