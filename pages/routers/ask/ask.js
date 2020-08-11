const App = getApp()
var util = require('../../../utils/util.js')
var config = require('../../../utils/app/config.js')
var reqAPI = config.defaultURL

Page({
  data: {
    navH: 0,
    lengthS: 0,
    lengthBoth: 0,
    lengthR: 0,
    open: false,
    search_view: false,
    refuse_view: false,
    search_status: false,
    type: 's',
    askInfoS: '',
    askInfoR: '',
    askInfoL: '',
    askInfoBoth: '',
    searchInfo: '',
    asktypeIndex: 0,
    asktypePick: ['请假类型▾', '✪课程假', '✪日常假', '✪假期往返统计'],
    asktypeValue: [undefined, 'c', 'd', 'h'],
    resStypeIndex: 0,
    resStypePick: ['请假结果▾', '✪进行中', '✪已通过', '✪未通过'],
    resStypeValue: [undefined, 'ing', 'yes', 'no'],
    resTtypeIndex: 0,
    resTtypePick: ['请假结果▾', '✪待审批', '✪已同意', '✪已拒绝'],
    resTtypeValue: [undefined, 'ing', 'yes', 'no'],
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
  asktypePicker: function(e) {
    var that = this
    var askInfoS = []
    var askInfoL = []
    var askInfoBoth = []
    var asktype = e.detail.value
    var openid = wx.getStorageSync('openid')

    this.setData({
      resStypeIndex: 0,
      resTtypeIndex: 0,
      asktypeIndex: e.detail.value,
      asktype: this.data.asktypeValue[e.detail.value],
    })

      if (openid) {
        wx.request({
          url: reqAPI + '/queryask',
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
              that.toShow()
            }

            if (asktype == 1) {
              for (var i = 0; i < res.data.number; i++) {
                if (res.data.results[i].type == 'c') {
                  askInfoS.push(res.data.results[i])
                }
              }
              for (var i = 0; i < res.data.number; i++) {
                if (res.data.results[i].type == 'c') {
                  askInfoBoth.push(res.data.results[i])
                }
              }
              for (var i = 0; i < res.data.number; i++) {
                if (res.data.results[i].l_name != 'none') {
                  if (res.data.results[i].type == 'c') {
                    askInfoL.push(res.data.results[i])
                  }
                }
              }
            }

            if (asktype == 2) {
              for (var i = 0; i < res.data.number; i++) {
                if (res.data.results[i].type == 'd') {
                  askInfoS.push(res.data.results[i])
                }
              }
              for (var i = 0; i < res.data.number; i++) {
                if (res.data.results[i].type == 'd') {
                  askInfoBoth.push(res.data.results[i])
                }
              }
              for (var i = 0; i < res.data.number; i++) {
                if (res.data.results[i].l_name != 'none') {
                  if (res.data.results[i].type == 'd') {
                    askInfoL.push(res.data.results[i])
                  }
                }
              }
            }

            if (asktype == 3) {
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
                    res.data.results[i]['start'] = util.formatTimestamp(res.data.results[i].start)
                    res.data.results[i]['end'] = util.formatTimestamp(res.data.results[i].end)
                    res.data.results[i]['create_time'] = util.formatTimestamps(res.data.results[i].id.slice(0, 10))
                  }
                  for (var i = 0; i < res.data.number; i++) {
                    askInfoS.push(res.data.results[i])
                  }

                  that.setData({
                    askInfoS: askInfoS.reverse(),
                    askInfoBoth: askInfoBoth.reverse(),
                    askInfoL: askInfoL.reverse(),
                    lengthS: askInfoS.length,
                    lengthBoth: askInfoBoth.length,
                  })
                }
              })
            }
            
            that.setData({
              askInfoS: askInfoS.reverse(),
              askInfoBoth: askInfoBoth.reverse(),
              askInfoL: askInfoL.reverse(),
              lengthS: askInfoS.length,
              lengthBoth: askInfoBoth.length,
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
  resStypePicker: function(e) {
    var that = this
    var openid = wx.getStorageSync('openid')
    var askInfoS = []

    this.setData({
      asktypeIndex: 0,
      resStypeIndex: e.detail.value,
      resStype: this.data.resStypeValue[e.detail.value],
    })
    if (e.detail.value == 0) {
      that.toShow()
    }
    if (e.detail.value == 1) {
      if (openid) {
        wx.request({
          url: reqAPI + '/queryask',
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
              if (res.data.results[i].b_result == 'none') {
                askInfoS.push(res.data.results[i])
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
                  res.data.results[i]['start'] = util.formatTimestamp(res.data.results[i].start)
                  res.data.results[i]['end'] = util.formatTimestamp(res.data.results[i].end)
                  res.data.results[i]['create_time'] = util.formatTimestamps(res.data.results[i].id.slice(0, 10))
                }
                for (var i = 0; i < res.data.number; i++) {
                  if (res.data.results[i].b_result == 'none') {
                    askInfoS.push(res.data.results[i])
                  }
                }

                that.setData({
                  askInfoS: askInfoS.reverse(),
                  lengthS: askInfoS.length,
                })
              }
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
    if (e.detail.value == 2) {
      if (openid) {
        wx.request({
          url: reqAPI + '/queryask',
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
              if (res.data.results[i].b_result == 'yes') {
                askInfoS.push(res.data.results[i])
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
                  res.data.results[i]['start'] = util.formatTimestamp(res.data.results[i].start)
                  res.data.results[i]['end'] = util.formatTimestamp(res.data.results[i].end)
                  res.data.results[i]['create_time'] = util.formatTimestamps(res.data.results[i].id.slice(0, 10))
                }
                for (var i = 0; i < res.data.number; i++) {
                  if (res.data.results[i].b_result == 'yes') {
                    askInfoS.push(res.data.results[i])
                  }
                }

                that.setData({
                  askInfoS: askInfoS.reverse(),
                  lengthS: askInfoS.length,
                })
              }
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
    if (e.detail.value == 3) {
      if (openid) {
        wx.request({
          url: reqAPI + '/queryask',
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
              if (res.data.results[i].b_result == 'no') {
                askInfoS.push(res.data.results[i])
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
                  res.data.results[i]['start'] = util.formatTimestamp(res.data.results[i].start)
                  res.data.results[i]['end'] = util.formatTimestamp(res.data.results[i].end)
                  res.data.results[i]['create_time'] = util.formatTimestamps(res.data.results[i].id.slice(0, 10))
                }
                for (var i = 0; i < res.data.number; i++) {
                  if (res.data.results[i].b_result == 'no') {
                    askInfoS.push(res.data.results[i])
                  }
                }

                that.setData({
                  askInfoS: askInfoS.reverse(),
                  lengthS: askInfoS.length,
                })
              }
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
  },
  resTtypePicker: function(e) {
    var that = this
    var openid = wx.getStorageSync('openid')
    var askInfoL = []
    var askInfoBoth = []

    this.setData({
      asktypeIndex: 0,
      resTtypeIndex: e.detail.value,
      resTtype: this.data.resTtypeValue[e.detail.value],
    })
    if (e.detail.value == 0) {
      that.toShow()
    }
    if (e.detail.value == 1) {
      if (openid) {
        wx.request({
          url: reqAPI + '/queryask',
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
              if (res.data.results[i].b_result == 'none') {
                askInfoBoth.push(res.data.results[i])
              }
            }
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].l_name != 'none') {
                if (res.data.results[i].l_result == 'none') {
                  askInfoL.push(res.data.results[i])
                }
              }
            }
            that.setData({
              askInfoBoth: askInfoBoth.reverse(),
              askInfoL: askInfoL.reverse(),
              lengthBoth: askInfoBoth.length,
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
    if (e.detail.value == 2) {
      if (openid) {
        wx.request({
          url: reqAPI + '/queryask',
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
              if (res.data.results[i].b_result == 'yes') {
                askInfoBoth.push(res.data.results[i])
              }
            }
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].l_name != 'none') {
                if (res.data.results[i].l_result == 'yes') {
                  askInfoL.push(res.data.results[i])
                }
              }
            }
            that.setData({
              askInfoBoth: askInfoBoth.reverse(),
              askInfoL: askInfoL.reverse(),
              lengthBoth: askInfoBoth.length,
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
    if (e.detail.value == 3) {
      if (openid) {
        wx.request({
          url: reqAPI + '/queryask',
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
              if (res.data.results[i].b_result == 'no') {
                askInfoBoth.push(res.data.results[i])
              }
            }
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].l_name != 'none') {
                if (res.data.results[i].l_result == 'no') {
                  askInfoL.push(res.data.results[i])
                }
              }
            }
            that.setData({
              askInfoBoth: askInfoBoth.reverse(),
              askInfoL: askInfoL.reverse(),
              lengthBoth: askInfoBoth.length,
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
  },
  cancel: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type

    wx.showModal({
      title: '提示',
      content: '是否撤销\n撤销后不可恢复',
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          if(type == 'c' || type == 'd'){
            wx.request({
              url: reqAPI + '/cancelask',
              data: {
                id: id,
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
                    title: '撤销成功',
                    duration: 1000.
                  })
                  that.toShow()
                } else {
                  wx.hideLoading()
                  wx.showModal({
                    title: '提示',
                    content: '撤销失败\n请检查网络',
                    showCancel: false,
                  })
                }
              }
            })
          } else {
            wx.request({
              url: reqAPI + '/cancelaskh',
              data: {
                id: id,
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
                    title: '撤销成功',
                    duration: 1000.
                  })
                  that.toShow()
                } else {
                  wx.hideLoading()
                  wx.showModal({
                    title: '提示',
                    content: '撤销失败\n请检查网络',
                    showCancel: false,
                  })
                }
              }
            })
          }
        }
      }
    })
  },
  previewImg: function(e) {
    var imglist = []
    imglist.push(e.currentTarget.dataset.imgurl)
    console.log(e.currentTarget.dataset.imgurl)
    wx.previewImage({
      urls: imglist,
    })
  },
  contactB: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  contactS: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  approve: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    var stuName = e.currentTarget.dataset.name
    var stuClass = e.currentTarget.dataset.class
    var stuid = e.currentTarget.dataset.stuid
    var sPhone = e.currentTarget.dataset.sphone
    var rPhone = e.currentTarget.dataset.rphone
    var course = e.currentTarget.dataset.course

    if (this.data.type == 'b' || this.data.type == 'j') {
      wx.showModal({
        title: '提示',
        content: '是否批准\n批准后不可恢复',
        showCancel: true,
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: reqAPI + '/bapprove',
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
                  that.toShow()
                  // 请假成功短信通知任课教师
                  if (type == 'c') {
                    wx.request({
                      url: reqAPI + '/smssuccesstot',
                      data: {
                        phone: rPhone,
                        class: stuClass,
                        name: stuName,
                        stuid: stuid,
                        course: course,
                      },
                      header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      method: 'POST',
                      success: function(res) {
                        if (res.data.status == 'success') {


                        } else {
                          wx.showModal({
                            title: '提示',
                            content: '短信通知任课教师失败\n请稍后重试',
                            showCancel: false,
                            confirmText: '确定'
                          })
                        }
                      }
                    })
                  }
                  // 请假成功短信通知学生
                  wx.request({
                    url: reqAPI + '/smssuccesstos',
                    data: {
                      phone: sPhone,
                      id: id,
                      result: '已通过',
                    },
                    header: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    success: function(res) {
                      if (res.data.status == 'success') {


                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '短信通知学生失败\n请稍后重试',
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
    if (this.data.type == 'l') {
      wx.showModal({
        title: '提示',
        content: '是否批准\n批准后不可恢复',
        showCancel: true,
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: reqAPI + '/lapprove',
              data: {
                id: id,
                l_result: 'yes',
                l_refuse_reason: 'none',
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
                  that.toShow()


                  // 请假成功短信通知任课教师
                  if (type == 'c') {
                    wx.request({
                      url: reqAPI + '/smssuccesstot',
                      data: {
                        phone: rPhone,
                        class: stuClass,
                        name: stuName,
                        stuid: stuid,
                        course: course,
                      },
                      header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      method: 'POST',
                      success: function(res) {
                        if (res.data.status == 'success') {


                        } else {
                          wx.showModal({
                            title: '提示',
                            content: '短信通知任课教师失败\n请稍后重试',
                            showCancel: false,
                            confirmText: '确定'
                          })
                        }
                      }
                    })
                  }
                  // 请假成功短信通知学生
                  wx.request({
                    url: reqAPI + '/smssuccesstos',
                    data: {
                      phone: sPhone,
                      id: id,
                      result: '已通过',
                    },
                    header: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    success: function(res) {
                      if (res.data.status == 'success') {


                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '短信通知学生失败\n请稍后重试',
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
  refuse: function(e) {
    var id = e.currentTarget.dataset.id
    var sPhone = e.currentTarget.dataset.sphone

    this.setData({
      refuse_view: true,
      refuse_id: id,
      s_phone: sPhone,
    })
  },
  refuseInput: function(e) {
    this.setData({
      refuse_reason: e.detail.value,
    })
  },
  refuseConfirm: function(e) {
    var that = this

    var sPhone = this.data.s_phone
    var refuse_id = this.data.refuse_id
    var refuse_reason = this.data.refuse_reason

    if (this.data.refuse_reason) {
      if (this.data.type == 'b' || this.data.type == 'j') {
        wx.showModal({
          title: '提示',
          content: '是否拒绝\n拒绝后不可恢复',
          showCancel: true,
          success: function(res) {
            if (res.confirm) {
              that.setData({
                refuse_view: false,
              })
              wx.request({
                url: reqAPI + '/bapprove',
                data: {
                  id: refuse_id,
                  b_result: 'no',
                  b_refuse_reason: refuse_reason,
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
                    that.toShow()

                    // 请假未通过短信通知学生
                    wx.request({
                      url: reqAPI + '/smssuccesstos',
                      data: {
                        phone: sPhone,
                        id: refuse_id,
                        result: '未通过',
                      },
                      header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      method: 'POST',
                      success: function(res) {
                        if (res.data.status == 'success') {


                        } else {
                          wx.showModal({
                            title: '提示',
                            content: '短信通知学生失败\n请稍后重试',
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
      if (this.data.type == 'l') {
        wx.showModal({
          title: '提示',
          content: '是否拒绝\n拒绝后不可恢复',
          showCancel: true,
          success: function(res) {
            if (res.confirm) {
              that.setData({
                refuse_view: false,
              })
              wx.request({
                url: reqAPI + '/lapprove',
                data: {
                  id: refuse_id,
                  l_result: 'no',
                  l_refuse_reason: refuse_reason,
                  b_result: 'no',
                  b_refuse_reason: refuse_reason,
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
                    that.toShow()

                    // 请假未通过短信通知学生
                    wx.request({
                      url: reqAPI + '/smssuccesstos',
                      data: {
                        phone: sPhone,
                        id: refuse_id,
                        result: '未通过',
                      },
                      header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      method: 'POST',
                      success: function(res) {
                        if (res.data.status == 'success') {


                        } else {
                          wx.showModal({
                            title: '提示',
                            content: '短信通知学生失败\n请稍后重试',
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
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整',
        showCancel: false,
        confirmText: '确定'
      })
    }
  },
  leaderInput: function(e) {
    this.setData({
      l_name: e.detail.value,
    })
  },
  transfer: function(e) {
    this.setData({
      transfer_id: e.currentTarget.dataset.id,
      transfer_stu_name: e.currentTarget.dataset.name,
      transfer_stu_class: e.currentTarget.dataset.class,
      search_view: true,
    })
  },
  extraCancel: function() {
    this.setData({
      refuse_view: false,
      search_view: false,
      search_status: false,
    })
  },
  searchL: function() {
    var that = this
    if (this.data.l_name) {
      wx.showLoading({
        title: '搜索中',
      })
      wx.request({
        url: reqAPI + '/searchleader',
        data: {
          name: this.data.l_name,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          console.log(res.data.results)
          if (res.data.results == null) {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '未找到匹配结果',
              showCancel: false,
              confirmText: '确定',
            })
          } else {
            wx.hideLoading()
            that.setData({
              search_view: false,
              search_status: true,
              searchInfo: res.data.results,
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整',
        showCancel: false,
        confirmText: '确定'
      })
    }
  },
  searchConfirm: function(e) {
    var that = this

    var name = e.currentTarget.dataset.name
    var phone = e.currentTarget.dataset.phone
    var openid = e.currentTarget.dataset.openid

    var id = this.data.transfer_id
    var stuName = this.data.transfer_stu_name
    var stuClass = this.data.transfer_stu_class

    wx.showModal({
      title: '提示',
      content: '是否转达\n确认后无法撤销',
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          that.setData({
            search_status: false,
          })
          wx.request({
            url: reqAPI + '/transferapprove',
            data: {
              id: id,
              l_name: name,
              l_openid: openid,
              l_phone: phone,
              l_result: 'none',
              l_refuse_reason: 'none',
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function(res) {
              console.log(res.data)
              if (res.data.status == 'success') {
                wx.request({
                  url: reqAPI + '/smsapprove',
                  data: {
                    phone: phone,
                    class: stuClass,
                    name: stuName,
                  },
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  method: 'POST',
                  success: function(res) {
                    if (res.data.status == 'success') {
                      wx.showToast({
                        title: '转达成功',
                        duration: 1000,
                      })
                      that.toShow()
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: '短信通知失败\n请稍后重试',
                        showCancel: false,
                        confirmText: '确定'
                      })
                    }
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '转达失败\n请稍后重试',
                  showCancel: false,
                  confirmText: '确定'
                })
              }
            }
          })
        } else {
          that.setData({
            search_status: false,
          })
        }
      }
    })
  },
  onLoad: function(options) {
    var that = this
    var askInfoS = []
    var askInfoR = []
    var askInfoL = []
    var askInfoBoth = []
    var openid = wx.getStorageSync('openid')

    this.setData({
      navH: App.globalData.navH,
      type: App.globalData.type,
    })

    if (openid) {
      if (Object.keys(options).length != 0) {
        if (options.ing == 'true') {
          wx.request({
            url: reqAPI + '/queryask',
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
                if (res.data.results[i].b_result == 'none') {
                  askInfoS.push(res.data.results[i])
                }
              }
              for (var i = 0; i < res.data.number; i++) {
                if (res.data.results[i].b_result == 'none') {
                  askInfoBoth.push(res.data.results[i])
                }
              }
              for (var i = 0; i < res.data.number; i++) {
                if (res.data.results[i].l_name != 'none') {
                  if (res.data.results[i].l_result == 'none') {
                    askInfoL.push(res.data.results[i])
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
                    res.data.results[i]['start'] = util.formatTimestamp(res.data.results[i].start)
                    res.data.results[i]['end'] = util.formatTimestamp(res.data.results[i].end)
                    res.data.results[i]['create_time'] = util.formatTimestamps(res.data.results[i].id.slice(0, 10))
                  }
                  for (var i = 0; i < res.data.number; i++) {
                    if (res.data.results[i].b_result == 'none') {
                      askInfoS.push(res.data.results[i])
                    }
                  }

                  that.setData({
                    askInfoS: askInfoS.reverse(),
                    askInfoBoth: askInfoBoth.reverse(),
                    askInfoL: askInfoL.reverse(),
                    lengthS: askInfoS.length,
                    lengthBoth: askInfoBoth.length,
                  })
                }
              })
            }
          })
        }
        if (options.yes == 'true') {
          wx.request({
            url: reqAPI + '/queryask',
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
                if (res.data.results[i].b_result == 'yes') {
                  askInfoS.push(res.data.results[i])
                }
              }
              for (var i = 0; i < res.data.number; i++) {
                if (res.data.results[i].b_result == 'yes') {
                  askInfoBoth.push(res.data.results[i])
                }
              }
              for (var i = 0; i < res.data.number; i++) {
                if (res.data.results[i].l_name != 'none') {
                  if (res.data.results[i].l_result == 'yes') {
                    askInfoL.push(res.data.results[i])
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
                    res.data.results[i]['start'] = util.formatTimestamp(res.data.results[i].start)
                    res.data.results[i]['end'] = util.formatTimestamp(res.data.results[i].end)
                    res.data.results[i]['create_time'] = util.formatTimestamps(res.data.results[i].id.slice(0, 10))
                  }
                  for (var i = 0; i < res.data.number; i++) {
                    if (res.data.results[i].b_result == 'yes') {
                      askInfoS.push(res.data.results[i])
                    }
                  }

                  that.setData({
                    askInfoS: askInfoS.reverse(),
                    askInfoBoth: askInfoBoth.reverse(),
                    askInfoL: askInfoL.reverse(),
                    lengthS: askInfoS.length,
                    lengthBoth: askInfoBoth.length,
                  })
                }
              })
            }
          })
        }
        if (options.no == 'true') {
          wx.request({
            url: reqAPI + '/queryask',
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
                if (res.data.results[i].b_result == 'no') {
                  askInfoS.push(res.data.results[i])
                }
              }
              for (var i = 0; i < res.data.number; i++) {
                if (res.data.results[i].b_result == 'no') {
                  askInfoBoth.push(res.data.results[i])
                }
              }
              for (var i = 0; i < res.data.number; i++) {
                if (res.data.results[i].l_name != 'none') {
                  if (res.data.results[i].l_result == 'no') {
                    askInfoL.push(res.data.results[i])
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
                    res.data.results[i]['start'] = util.formatTimestamp(res.data.results[i].start)
                    res.data.results[i]['end'] = util.formatTimestamp(res.data.results[i].end)
                    res.data.results[i]['create_time'] = util.formatTimestamps(res.data.results[i].id.slice(0, 10))
                  }
                  for (var i = 0; i < res.data.number; i++) {
                    if (res.data.results[i].b_result == 'no') {
                      askInfoS.push(res.data.results[i])
                    }
                  }

                  that.setData({
                    askInfoS: askInfoS.reverse(),
                    askInfoBoth: askInfoBoth.reverse(),
                    askInfoL: askInfoL.reverse(),
                    lengthS: askInfoS.length,
                    lengthBoth: askInfoBoth.length,
                  })
                }
              })
            }
          })
        }
      } else {
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
            console.log(res.data)
            for (var i = 0; i < res.data.number; i++) {
              res.data.results[i]['start'] = util.formatTimestamp(res.data.results[i].start)
              res.data.results[i]['end'] = util.formatTimestamp(res.data.results[i].end)
              res.data.results[i]['create_time'] = util.formatTimestamps(res.data.results[i].id.slice(0, 10))
            }
            for (var i = 0; i < res.data.number; i++) {
              askInfoS.push(res.data.results[i])
            }
            for (var i = 0; i < res.data.number; i++) {
              askInfoBoth.push(res.data.results[i])
            }
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].b_result == 'yes' && res.data.results[i].type == 'c') {
                askInfoR.push(res.data.results[i])
              }
            }
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].l_name != 'none') {
                askInfoL.push(res.data.results[i])
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
                  res.data.results[i]['start'] = util.formatTimestamp(res.data.results[i].start)
                  res.data.results[i]['end'] = util.formatTimestamp(res.data.results[i].end)
                  res.data.results[i]['create_time'] = util.formatTimestamps(res.data.results[i].id.slice(0, 10))
                }
                for (var i = 0; i < res.data.number; i++) {
                  askInfoS.push(res.data.results[i])
                }

                that.setData({
                  askInfoS: askInfoS.reverse(),
                  askInfoBoth: askInfoBoth.reverse(),
                  askInfoR: askInfoR.reverse(),
                  askInfoL: askInfoL.reverse(),
                  lengthS: askInfoS.length,
                  lengthBoth: askInfoBoth.length,
                  lengthR: askInfoR.length,
                })
              }
            })
          }
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请检查网络',
        showCancel: false,
        confirmText: '确定'
      })
    }
  },
  toShow: function() {
    var that = this
    var askInfoS = []
    var askInfoR = []
    var askInfoL = []
    var askInfoBoth = []
    var openid = wx.getStorageSync('openid')

    if(openid) {
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
          console.log(res.data)
          for (var i = 0; i < res.data.number; i++) {
            res.data.results[i]['start'] = util.formatTimestamp(res.data.results[i].start)
            res.data.results[i]['end'] = util.formatTimestamp(res.data.results[i].end)
            res.data.results[i]['create_time'] = util.formatTimestamps(res.data.results[i].id.slice(0, 10))
          }
          for (var i = 0; i < res.data.number; i++) {
            askInfoS.push(res.data.results[i])
          }
          for (var i = 0; i < res.data.number; i++) {
            askInfoBoth.push(res.data.results[i])
          }
          for (var i = 0; i < res.data.number; i++) {
            if (res.data.results[i].b_result == 'yes' && res.data.results[i].type == 'c') {
              askInfoR.push(res.data.results[i])
            }
          }
          for (var i = 0; i < res.data.number; i++) {
            if (res.data.results[i].l_name != 'none') {
              askInfoL.push(res.data.results[i])
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
                res.data.results[i]['start'] = util.formatTimestamp(res.data.results[i].start)
                res.data.results[i]['end'] = util.formatTimestamp(res.data.results[i].end)
                res.data.results[i]['create_time'] = util.formatTimestamps(res.data.results[i].id.slice(0, 10))
              }
              for (var i = 0; i < res.data.number; i++) {
                askInfoS.push(res.data.results[i])
              }

              that.setData({
                askInfoS: askInfoS.reverse(),
                askInfoBoth: askInfoBoth.reverse(),
                askInfoR: askInfoR.reverse(),
                askInfoL: askInfoL.reverse(),
                lengthS: askInfoS.length,
                lengthBoth: askInfoBoth.length,
                lengthR: askInfoR.length,
              })
            }
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
  //回退
  navBack() {
    wx.navigateBack()
  },
  //回主页
  toHome() {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },
})