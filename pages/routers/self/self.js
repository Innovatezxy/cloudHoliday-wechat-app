const App = getApp()
var config = require('../../../utils/app/config.js')
var reqAPI = config.defaultURL

Page({
  data: {
    navH: 0,
    sms_wait: 60,
    userInfo: '',
    class_view: false,
    phone_view: false,
    login_status: '登录',
    code_status: false,
    code_time: '获取验证码',
    code_color: '#000',
  },
  changeClass: function() {
    this.setData({
      class_view: true,
    })
  },
  changePhone: function() {
    this.setData({
      phone_view: true,
    })
  },
  extraCancel: function() {
    this.setData({
      class_view: false,
      phone_view: false,
    })
  },
  classInput: function(e) {
    this.setData({
      stu_class: e.detail.value,
    })
  },
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  codeInput: function(e) {
    this.setData({
      sms_code: e.detail.value,
    })
  },
  smsCode: function() {
    var that = this
    if (this.data.phone == undefined || this.data.phone.length != 11) {
      wx.showModal({
        title: '提示',
        content: '请正确填写手机号',
        showCancel: false,
        confirmText: '确定'
      })
    } else {
      var inter = setInterval(function() {
        this.setData({
          code_status: true,
          code_color: '#cccccc',
          code_time: this.data.sms_wait + 's后重发',
          sms_wait: this.data.sms_wait - 1
        });
        if (this.data.sms_wait < 0) {
          clearInterval(inter)
          this.setData({
            code_status: false,
            code_color: '#000',
            code_time: '获取验证码',
            sms_wait: 60,
          });
        }
      }.bind(this), 1000)
      wx.request({
        url: reqAPI + '/smschangecode',
        data: {
          phone: this.data.phone,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          if (res.data.status == 'success') {
            that.setData({
              sms_code_check: res.data.results.split('').reverse().join(''),
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '发送失败\n请检查手机号或重新发送',
              showCancel: false,
              confirmText: '确定'
            })
          }
        }
      })
    }
  },
  confirmClass: function() {
    var that = this
    var openid = this.data.userInfo.openid
    var newClass = this.data.stu_class

    if (this.data.userInfo) {
      if (this.data.stu_class == undefined || this.data.stu_class == '') {
        wx.showModal({
          title: '提示',
          content: '请填写完整',
          showCancel: false,
          confirmText: '确定'
        })
      } else {
        wx.request({
          url: reqAPI + '/editstdclass',
          data: {
            id: openid,
            class: newClass,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function(res) {
            console.log(res.data)
            if (res.data.status == 'success') {
              wx.showToast({
                title: '修改成功',
              })
              that.setData({
                class_view: false,
              })
              that.onLoad()
            } else {
              that.setData({
                class_view: false,
              })
              wx.showModal({
                title: '提示',
                content: '更换失败\n请检查手机号或重新发送',
                showCancel: false,
                confirmText: '确定'
              })
            }
          }
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '获取失败\n请检查网络',
        showCancel: false,
        confirmText: '确定'
      })
    }
  },
  confirmPhone: function() {
    var that = this
    var openid = this.data.userInfo.openid
    var type = this.data.userInfo.type
    var newPhone = this.data.phone

    if (this.data.userInfo) {
      if(this.data.sms_code == undefined || this.data.sms_code.length == 0){
        wx.showModal({
          title: '提示',
          content: '请填写验证码',
          showCancel: false,
          confirmText: '确定'
        })
      } else {
        if (this.data.sms_code == that.data.sms_code_check) {
          if (type == 'b' || type == 'j' || type == 'r' || type == 'l') {
            wx.request({
              url: reqAPI + '/editteacherphone',
              data: {
                id: openid,
                phone: newPhone,
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function (res) {
                console.log(res.data)
                if (res.data.status == 'success') {
                  wx.showToast({
                    title: '更换成功',
                  })
                  that.setData({
                    phone_view: false,
                  })
                  that.onLoad()
                } else {
                  that.setData({
                    phone_view: false,
                  })
                  wx.showModal({
                    title: '提示',
                    content: '更换失败\n请检查手机号或重新发送',
                    showCancel: false,
                    confirmText: '确定'
                  })
                }
              }
            })
          }
          if (type == 's') {
            wx.request({
              url: reqAPI + '/editstdphone',
              data: {
                id: openid,
                phone: newPhone,
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function (res) {
                console.log(res.data)
                if (res.data.status == 'success') {
                  wx.showToast({
                    title: '更换成功',
                  })
                  that.setData({
                    phone_view: false,
                  })
                  that.onLoad()
                } else {
                  that.setData({
                    phone_view: false,
                  })
                  wx.showModal({
                    title: '提示',
                    content: '更换失败\n请检查手机号或重新发送',
                    showCancel: false,
                    confirmText: '确定'
                  })
                }
              }
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '验证码错误',
            showCancel: false,
            confirmText: '确定'
          })
        }
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '获取失败\n请检查网络',
        showCancel: false,
        confirmText: '确定'
      })
    }
  },
  login: function() {
    if (this.data.login_status == '登录') {
      wx.redirectTo({
        url: '/pages/routers/wellcome/wellcome',
      })
    }
    if (this.data.login_status == '退出登录') {
      wx.showModal({
        title: '提示',
        content: '是否退出\n退出登录将清除本设备缓存并需要重新授权',
        showCancel: true,
        success: function(res) {
          if (res.confirm) {
            wx.clearStorage()
            wx.redirectTo({
              url: '/pages/routers/wellcome/wellcome',
            })
          }
        }
      })
    }
  },
  onLoad: function() {
    var that = this
    var admin_id = wx.getStorageSync('admin_id')
    var admin_pwd = wx.getStorageSync('admin_pwd')
    var openid = wx.getStorageSync('openid')
    var user_type = wx.getStorageSync('user_type')
    console.log(this.data.userInfo)

    this.setData({
      navH: App.globalData.navH,
    })
    if (admin_id && admin_pwd) {
      this.setData({
        login_status: '退出登录',
      })
    } else {
      if (openid) {
        this.setData({
          login_status: '退出登录',
        })
        if (user_type) {
          if (user_type == 'a') {
            wx.request({
              url: reqAPI + '/admininfo',
              data: {
                id: admin_id,
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function(res) {
                that.setData({
                  userInfo: res.data.results[0],
                })
              }
            })
          } else if (user_type == 'l' || user_type == 'b' || user_type == 'r' || user_type == 'j') {
            wx.request({
              url: reqAPI + '/teacherinfo',
              data: {
                id: openid,
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function(res) {
                that.setData({
                  userInfo: res.data.results[0],
                })
              }
            })
          } else {
            wx.request({
              url: reqAPI + '/stdinfo',
              data: {
                id: openid,
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function(res) {
                that.setData({
                  userInfo: res.data.results[0],
                })
              }
            })
          }
        } else {
          wx.request({
            url: reqAPI + '/teacherinfo',
            data: {
              id: openid,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function(res) {
              if (res.data.results == null) {
                wx.request({
                  url: reqAPI + '/stdinfo',
                  data: {
                    id: openid,
                  },
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  method: 'POST',
                  success: function(res) {

                    that.setData({
                      userInfo: res.data.results[0],
                    })
                  }
                })
              } else {
                that.setData({
                  userInfo: res.data.results[0],
                })
              }
            }
          })
        }
      } else {
        this.setData({
          login_status: '登录',
        })
      }
    }
  },
})