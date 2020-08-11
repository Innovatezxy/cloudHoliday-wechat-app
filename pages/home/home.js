// 初始化
const App = getApp()
var util = require('../../utils/util.js')
var config = require('../../utils/app/config.js')
var reqAPI = config.defaultURL
var WXBizDataCrypt = require('../../utils/cryptojs-master/RdWXBizDataCrypt.js')

Page({
  data: {
    navH: 0,
    lengthBoth: 0,
    lengthR: 0,
    s_number: 0,
    b_number: 0,
    l_number: 0,
    r_number: 0,
    b_current_number: 0,
    s_current_number: 0,
    l_current_number: 0,
    msgList: '',
    askInfoBoth: '',
    askInfoR: '',
    askInfoL: '',
    isB: false,
    isR: false,
    isUpload: false,
    login_status: true,
    search_status: false,
    course_status: false,
    upload_status: true,
    destination_status: false,
    type: '',
    b_name: '',
    r_name: '',
    userInfo: '',
    askInfo: '',
    searchInfo: '',
    start_time: '',
    end_time: '',
    imgUrl: '',
    remark: '',
    reason: '',
    disabled: false, //设置是否能点击 false可以 true不能点击
    startDate: '2019/09/01 00:00',
    endDate: '2024/09/01 12:00',
    placeholder: '请选择',
    typeIndex: 0,
    typePick: ['请选择', '课程假', '日常假', '假期往返统计'],
    typeValue: [undefined, 'c', 'd', 'h'],
    sex: '未检测',
    age: '未检测',
    emotion: '未检测',
    faceauth_status: false,
  },
  // 请假类型选择
  typePicker: function(e) {
    this.setData({
      typeIndex: e.detail.value,
      type: this.data.typeValue[e.detail.value],
    })
    if (this.data.typeValue[e.detail.value] == 'c') {
      this.setData({
        course_status: true,
        upload_status: true,
        destination_status: false,
      })
    } else if (this.data.typeValue[e.detail.value] == 'h') {
      this.setData({
        course_status: false,
        upload_status: false,
        destination_status: true,
      })
    } else {
      this.setData({
        course_status: false,
        upload_status: true,
        destination_status: false,
      })
    }
  },
  // 请假备注
  remarkInput: function(e) {
    this.setData({
      remark: e.detail.value,
    })
  },
  // 开始日期选择
  startPickerChange: function(e) {
    console.log(Date.parse(e.detail.dateString.replace(/-/g, "/")) / 1000)
    this.setData({
      start_time: e.detail.dateString.replace(/-/g, "/"),
    })
  },
  // 结束日期选择
  endPickerChange: function(e) {
    console.log(Date.parse(e.detail.dateString.replace(/-/g, "/")) / 1000)
    this.setData({
      end_time: e.detail.dateString.replace(/-/g, "/"),
    })
  },
  // 教师判断
  bteacherInput: function(e) {
    this.setData({
      isB: true,
      isR: false,
      bteacher: e.detail.value,
    })
  },
  // 搜索班主任
  searchB: function() {
    var that = this
    if (this.data.bteacher) {
      wx.showLoading({
        title: '搜索中',
      })
      wx.request({
        url: reqAPI + '/searchusers',
        data: {
          name: this.data.bteacher,
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
              success: function(res) {
                if (res.confirm) {
                  that.setData({
                    search_status: false,
                  })
                }
              }
            })
          } else {
            wx.hideLoading()
            that.setData({
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
  // 任课教师输入
  rteacherInput: function(e) {
    this.setData({
      isB: false,
      isR: true,
      rteacher: e.detail.value,
    })
  },
  // 搜索任课教师
  searchR: function() {
    var that = this
    if (this.data.rteacher) {
      wx.showLoading({
        title: '搜索中',
      })
      wx.request({
        url: reqAPI + '/searchusers',
        data: {
          name: this.data.rteacher,
          type: 't',
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
              success: function(res) {
                if (res.confirm) {
                  that.setData({
                    search_status: false,
                  })
                }
              }
            })
          } else {
            wx.hideLoading()
            that.setData({
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
  // 确认搜索结果
  searchConfirm: function(e) {
    var name = e.currentTarget.dataset.name
    var phone = e.currentTarget.dataset.phone
    var openid = e.currentTarget.dataset.openid
    console.log(name, phone, openid)
    if (this.data.isB == true) {
      this.setData({
        b_name: name,
        b_phone: phone,
        b_openid: openid,
        search_status: false,
      })
    }
    if (this.data.isR == true) {
      this.setData({
        r_name: name,
        r_phone: phone,
        r_openid: openid,
        search_status: false,
      })
    }
  },
  // 取消搜索
  searchCancel: function() {
    this.setData({
      search_status: false,
    })
  },
  // 请假原因输入
  reasonInput: function(e) {
    this.setData({
      reason: e.detail.value,
    })
  },
  // 上传凭证图片
  uploadImg: function() {
    var that = this
    var stuid = this.data.userInfo.stuid
    var timestamps = Date.parse(new Date()) / 1000
    var id = timestamps + stuid.slice(0, 2) + stuid.slice(7, 11)
    console.log(id)

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({
          isUpload: true,
          imgUrl: res.tempFilePaths[0],
        })
      }
    })
  },
  // 预览图片
  previewImg: function() {
    var imglist = []
    imglist.push(this.data.imgUrl)
    wx.previewImage({
      urls: imglist
    })
  },
  // 删除图片
  deleteImg: function() {
    this.setData({
      isUpload: false,
      imgUrl: '',
    })
    wx.showToast({
      title: '已删除',
      duration: 1000,
    })
  },
  detail: function() {
    wx.navigateTo({
      url: '/pages/routers/ask/ask',
    })
  },
  // 监听页面显示
  onShow: function() {
    var that = this
    this.camera = wx.createCameraContext()
    var admin_id = wx.getStorageSync('admin_id')
    var admin_pwd = wx.getStorageSync('admin_pwd')
    var openid = wx.getStorageSync('openid')
    var user_type = wx.getStorageSync('user_type')
    var ymdhm = util.formatYMDHM(new Date())
    var now_timestamps = Date.parse(new Date()) / 1000
    console.log(this.data.userInfo)

    wx.stopPullDownRefresh()
    this.setData({
      navH: App.globalData.navH,
      start_time: ymdhm,
      end_time: ymdhm,
    })

    // 初始化获取滚动公告栏通知
    wx.request({
      url: reqAPI + '/queryrollnotice',
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.setData({
          msgList: res.data.results
        })
      }
    })

    if (admin_id && admin_pwd) {
      this.setData({
        login_status: false,
      })
    } else {
      if (openid) {
        this.setData({
          login_status: false,
        })
        wx.showLoading({
          title: '加载中',
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
                wx.hideLoading()
                that.setData({
                  userInfo: res.data.results[0],
                })
                App.globalData.name = res.data.results[0].name
                App.globalData.type = res.data.results[0].type
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
                wx.hideLoading()
                that.setData({
                  userInfo: res.data.results[0],
                })
                App.globalData.name = res.data.results[0].name
                App.globalData.type = res.data.results[0].type
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
                wx.hideLoading()
                that.setData({
                  userInfo: res.data.results[0],
                })
                App.globalData.name = res.data.results[0].name
                App.globalData.type = res.data.results[0].type
                App.globalData.formid = res.data.results[0].formid
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
                    wx.hideLoading()
                    that.setData({
                      userInfo: res.data.results[0],
                    })
                    App.globalData.name = res.data.results[0].name
                    App.globalData.type = res.data.results[0].type
                    App.globalData.formid = res.data.results[0].formid
                  }
                })
              } else {
                that.setData({
                  userInfo: res.data.results[0],
                })
                App.globalData.name = res.data.results[0].name
                App.globalData.type = res.data.results[0].type
              }
            }
          })
        }

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
            wx.hideLoading()
            console.log(res.data)
            var s_number = 0
            var b_number = 0
            var r_number = 0
            var l_number = 0
            var l_current_number = 0
            var b_current_number = 0
            var s_current_number = 0
            var askInfoR = []
            var askInfoL = []
            var askInfoBoth = []
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
            }
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].b_result != 'none') {
                b_number++
              }
              if (i < 10) {
                askInfoBoth.push(res.data.results[i])
              }
              if (res.data.results[i].b_result == 'none') {
                b_current_number++
              }
            }
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].b_result == 'yes' && res.data.results[i].type == 'c') {
                r_number++
                if (i < 10) {
                  askInfoR.push(res.data.results[i])
                }
              }
            }
            for (var i = 0; i < res.data.number; i++) {
              if (res.data.results[i].l_name != 'none') {
                askInfoL.push(res.data.results[i])
                if (res.data.results[i].l_result != 'none') {
                  l_number++
                }
                if (res.data.results[i].l_result == 'none') {
                  l_current_number++
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
              success: function(res) {
                console.log(res.data)
                for (var i = 0; i < res.data.number; i++) {
                  s_number++
                  if (res.data.results[i].b_result == 'none') {
                    s_current_number++
                  }
                }

                that.setData({
                  s_number: s_number,
                  b_number: b_number,
                  l_number: l_number,
                  r_number: r_number,
                  b_current_number: b_current_number,
                  s_current_number: s_current_number,
                  l_current_number: l_current_number,
                  askInfoBoth: askInfoBoth.reverse(),
                  askInfoR: askInfoR.reverse(),
                  askInfoL: askInfoL.reverse(),
                  lengthBoth: askInfoBoth.length,
                  lengthR: askInfoR.length,
                })
              }
            })
          }
        })
      } else {
        this.setData({
          login_status: true,
        })
      }
    }
  },
  // 提交申请
  askSubmit: function() {
    if (this.data.typeIndex == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择请假类型',
        showCancel: false,
        confirmText: '确定'
      })
    } else {
      this.setData({
        faceauth_status: true,
      })
    }
  },
  // 人脸识别认证
  auth: function(e) {
    var that = this
    if (this.data.userInfo != '') {
      var formid = e.detail.formId
      var imgpath = this.data.imgUrl
      var stuid = this.data.userInfo.stuid
      var timestamps = Date.parse(new Date()) / 1000
      var id = timestamps + stuid.slice(2, 4) + stuid.slice(7, 11)
      var type = this.data.type
      var sOpenid = this.data.userInfo.openid
      var name = this.data.userInfo.name
      var male = this.data.userInfo.male
      var academy = this.data.userInfo.academy
      var stuClass = this.data.userInfo.class
      var start = Date.parse(this.data.start_time) / 1000
      var end = Date.parse(this.data.end_time) / 1000
      console.log(start, end)
      var remark = this.data.remark
      var reason = this.data.reason
      var isUpload = this.data.isUpload
      var rName = this.data.r_name
      var rOpenid = this.data.r_openid
      var rPhone = this.data.r_phone
      var bName = this.data.b_name
      var bOpenid = this.data.b_openid
      var bPhone = this.data.b_phone
      var sPhone = this.data.userInfo.phone

      var code = 'imnu'
      var openid = wx.getStorageSync('openid')
      var time = util.formatTimeID(new Date())
      var camera = wx.createCameraContext()

      this.camera.takePhoto({
        quality: 'low',
        success: (res) => {
          wx.showLoading({
            title: '检测中',
          })
          wx.uploadFile({
            url: 'https://www.enjfun.com/wecloud/faceupload?code=' + code + '&&xh=' + openid + '&&time=' + time,
            filePath: res.tempImagePath,
            name: 'checkimg',
            header: {
              "Content-Type": "multipart/form-data"
            },
            success(res) {
              if (res.statusCode == 200) {
                console.log(res)
                wx.hideLoading()
                wx.showLoading({
                  title: '识别中',
                })
                that.setData({
                  checkurl: res.data
                })
                wx.request({
                  url: 'https://www.enjfun.com/wecloud/facebase?faceurl=' + 'https://www.enjfun.com/facesign/' + code + '_' + openid + '_baseimg.jpg',
                  method: 'GET',
                  header: {
                    'Content-Type': 'application/json'
                  },
                  success: function(res) {
                    console.log(res)
                    if (res.header['Content-Length'] == '234') {
                      wx.hideLoading()
                      wx.showModal({
                        title: '提示',
                        content: '数据库暂未录入你的人脸模板，试试体验趣味功能吧',
                        showCancel: false,
                        success: function(res) {
                          if (res.confirm) {
                            wx.showLoading({
                              title: '识别中',
                            })
                            wx.request({
                              url: 'https://www.enjfun.com/wecloud/facecheck?faceurl=' + that.data.checkurl,
                              method: 'GET',
                              header: {
                                'Content-Type': 'application/json'
                              },
                              success: function(res) {
                                console.log(res)
                                wx.hideLoading()
                                wx.showLoading({
                                  title: '识别中',
                                })
                                if (res.data.result.length == 0) {
                                  wx.hideLoading()
                                  wx.showModal({
                                    title: '提示',
                                    content: '未能检测到人脸，请在光线充足的环境下重新验证',
                                    showCancel: false,
                                  })
                                } else {
                                  wx.hideLoading()
                                  that.setData({
                                    age: res.data.result[0].faceAttributes.age,
                                  })
                                  if (res.data.result[0].faceAttributes.gender == 'male') {
                                    that.setData({
                                      sex: '男'
                                    })
                                  } else {
                                    that.setData({
                                      sex: '女'
                                    })
                                  }
                                  if (res.data.result[0].faceAttributes.emotion.happiness >= 0.5) {
                                    that.setData({
                                      emotion: '开心的'
                                    })
                                  } else if (res.data.result[0].faceAttributes.emotion.sadness >= 0.2) {
                                    that.setData({
                                      emotion: '伤心的'
                                    })
                                  } else if (res.data.result[0].faceAttributes.emotion.surprise >= 0.2) {
                                    that.setData({
                                      emotion: '惊讶的'
                                    })
                                  } else if (res.data.result[0].faceAttributes.emotion.anger >= 0.2) {
                                    that.setData({
                                      emotion: '生气的'
                                    })
                                  } else if (res.data.result[0].faceAttributes.emotion.contempt >= 0.2) {
                                    that.setData({
                                      emotion: '轻蔑的'
                                    })
                                  } else if (res.data.result[0].faceAttributes.emotion.fear >= 0.2) {
                                    that.setData({
                                      emotion: '害怕的'
                                    })
                                  } else if (res.data.result[0].faceAttributes.emotion.disgust >= 0.2) {
                                    that.setData({
                                      emotion: '厌恶的'
                                    })
                                  } else {
                                    that.setData({
                                      emotion: '平淡的'
                                    })
                                  }
                                }
                              }
                            })
                          }
                        },
                      })
                    } else {
                      that.setData({
                        faceid1: res.data.result[0].faceId
                      })
                      wx.request({
                        url: 'https://www.enjfun.com/wecloud/facecheck?faceurl=' + that.data.checkurl,
                        method: 'GET',
                        header: {
                          'Content-Type': 'application/json'
                        },
                        success: function(res) {
                          console.log(res)
                          wx.hideLoading()
                          wx.showLoading({
                            title: '上传比对中',
                          })
                          if (res.data.result.length == 0) {
                            wx.hideLoading()
                            wx.showModal({
                              title: '提示',
                              content: '未能检测到人脸，请在光线充足的环境下重新验证',
                              showCancel: false,
                            })
                          } else {
                            wx.hideLoading()
                            wx.showLoading({
                              title: '验证中',
                            })
                            if (res.data.result[0].faceAttributes.gender == 'male') {
                              that.setData({
                                sex: '男'
                              })
                            } else {
                              that.setData({
                                sex: '女'
                              })
                            }
                            if (res.data.result[0].faceAttributes.emotion.happiness >= 0.5) {
                              that.setData({
                                emotion: '开心的'
                              })
                            } else if (res.data.result[0].faceAttributes.emotion.sadness >= 0.2) {
                              that.setData({
                                emotion: '伤心的'
                              })
                            } else if (res.data.result[0].faceAttributes.emotion.surprise >= 0.2) {
                              that.setData({
                                emotion: '惊讶的'
                              })
                            } else if (res.data.result[0].faceAttributes.emotion.anger >= 0.2) {
                              that.setData({
                                emotion: '生气的'
                              })
                            } else if (res.data.result[0].faceAttributes.emotion.contempt >= 0.2) {
                              that.setData({
                                emotion: '轻蔑的'
                              })
                            } else if (res.data.result[0].faceAttributes.emotion.fear >= 0.2) {
                              that.setData({
                                emotion: '害怕的'
                              })
                            } else if (res.data.result[0].faceAttributes.emotion.disgust >= 0.2) {
                              that.setData({
                                emotion: '厌恶的'
                              })
                            } else {
                              that.setData({
                                emotion: '平淡的'
                              })
                            }
                            that.setData({
                              age: res.data.result[0].faceAttributes.age,
                              faceid2: res.data.result[0].faceId
                            })
                            wx.request({
                              url: 'https://www.enjfun.com/wecloud/faceverify?faceid1=' + that.data.faceid1 + '&&faceid2=' + that.data.faceid2,
                              method: 'GET',
                              header: {
                                'Content-Type': 'application/json'
                              },
                              success: function(res) {
                                console.log(res)
                                if (res.data.result.confidence >= 0.6) {
                                  wx.hideLoading()
                                  wx.showToast({
                                    title: '认证成功',
                                    inon: 'success',
                                    duration: 1000,
                                  })

                                  that.setData({
                                    faceauth_status: false,
                                  })

                                  if (type == 'c') {
                                    if (remark == '' || start == '' || end == '' || bName == '' || bOpenid == '' || bPhone == '' || rName == '' || rOpenid == '' || rPhone == '' || reason == '') {
                                      wx.showModal({
                                        title: '提示',
                                        content: '请填写完整\n并检查输入班主任或任课教师姓名后点击回车在搜索结果中选中教师并确定',
                                        showCancel: false,
                                        confirmText: '确定'
                                      })
                                    } else {
                                      wx.showModal({
                                        title: '提示',
                                        content: '是否提交\n提交后不可修改',
                                        showCancel: true,
                                        success: function(res) {
                                          if (res.confirm) {
                                            wx.showLoading({
                                              title: '提交中',
                                            })
                                            if (isUpload == false) {
                                              wx.request({
                                                url: reqAPI + '/ask',
                                                data: {
                                                  id: id,
                                                  type: type,
                                                  s_openid: sOpenid,
                                                  name: name,
                                                  male: male,
                                                  stuid: stuid,
                                                  academy: academy,
                                                  class: stuClass,
                                                  start: start,
                                                  end: end,
                                                  remark: remark,
                                                  reason: reason,
                                                  reason_img: 'none',
                                                  r_name: rName,
                                                  r_openid: rOpenid,
                                                  r_phone: rPhone,
                                                  b_name: bName,
                                                  b_openid: bOpenid,
                                                  b_phone: bPhone,
                                                  b_result: 'none',
                                                  b_refuse_reason: 'none',
                                                  l_name: 'none',
                                                  l_openid: 'none',
                                                  l_phone: 'none',
                                                  l_result: 'none',
                                                  l_refuse_reason: 'none',
                                                  s_phone: sPhone,
                                                },
                                                header: {
                                                  'Content-Type': 'application/x-www-form-urlencoded'
                                                },
                                                method: 'POST',
                                                success: function(res) {
                                                  console.log(res.data)
                                                  wx.hideLoading()
                                                  wx.request({
                                                    url: reqAPI + '/smsapprove',
                                                    data: {
                                                      phone: bPhone,
                                                      class: stuClass,
                                                      name: name,
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
                                                          content: '短信通知失败\n请稍后重试',
                                                          showCancel: false,
                                                          confirmText: '确定'
                                                        })
                                                      }
                                                    }
                                                  })
                                                  wx.request({
                                                    url: reqAPI + '/updatefid',
                                                    data: {
                                                      openid: sOpenid,
                                                      formid: formid,
                                                    },
                                                    header: {
                                                      'Content-Type': 'application/x-www-form-urlencoded'
                                                    },
                                                    method: 'POST',
                                                    success: function(res) {
                                                      if (res.data.status == 'success') {
                                                        wx.showToast({
                                                          title: '提交成功',
                                                        })
                                                        wx.reLaunch({
                                                          url: '/pages/home/home',
                                                        })
                                                      } else {
                                                        wx.showModal({
                                                          title: '提示',
                                                          content: 'FormId更新失败',
                                                          showCancel: false,
                                                          confirmText: '确定'
                                                        })
                                                      }
                                                    }
                                                  })
                                                }
                                              })
                                            } else {
                                              wx.showModal({
                                                title: '重要提示',
                                                content: '选择图片后由于原时间已失效，需要‘重新设置’开始时间及结束时间，否则提交后信息有误',
                                                showCancel: true,
                                                confirmText: '确认无误',
                                                cancelText: '修改时间',
                                                success: function(res) {
                                                  if (res.cancel) {
                                                    wx.hideLoading()
                                                  }
                                                  if (res.confirm) {
                                                    wx.uploadFile({
                                                      url: reqAPI + '/uploadcer?id=' + id,
                                                      filePath: imgpath,
                                                      name: 'certificate',
                                                      header: {
                                                        "Content-Type": "multipart/form-data"
                                                      },
                                                      method: 'GET',
                                                      success(res) {
                                                        console.log(res)
                                                        if (res.statusCode == 200) {
                                                          wx.request({
                                                            url: reqAPI + '/ask',
                                                            data: {
                                                              id: id,
                                                              type: type,
                                                              s_openid: sOpenid,
                                                              name: name,
                                                              male: male,
                                                              stuid: stuid,
                                                              academy: academy,
                                                              class: stuClass,
                                                              start: start,
                                                              end: end,
                                                              remark: remark,
                                                              reason: reason,
                                                              reason_img: 'https://www.enjfun.com/img/cloudholiday/certificate/' + id + '_cer.jpg',
                                                              r_name: rName,
                                                              r_openid: rOpenid,
                                                              r_phone: rPhone,
                                                              b_name: bName,
                                                              b_openid: bOpenid,
                                                              b_phone: bPhone,
                                                              b_result: 'none',
                                                              b_refuse_reason: 'none',
                                                              l_name: 'none',
                                                              l_openid: 'none',
                                                              l_phone: 'none',
                                                              l_result: 'none',
                                                              l_refuse_reason: 'none',
                                                              s_phone: sPhone,
                                                            },
                                                            header: {
                                                              'Content-Type': 'application/x-www-form-urlencoded'
                                                            },
                                                            method: 'POST',
                                                            success: function(res) {
                                                              console.log(res.data)
                                                              wx.hideLoading()
                                                              wx.request({
                                                                url: reqAPI + '/smsapprove',
                                                                data: {
                                                                  phone: bPhone,
                                                                  class: stuClass,
                                                                  name: name,
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
                                                                      content: '短信通知失败\n请稍后重试',
                                                                      showCancel: false,
                                                                      confirmText: '确定'
                                                                    })
                                                                  }
                                                                }
                                                              })
                                                              wx.request({
                                                                url: reqAPI + '/updatefid',
                                                                data: {
                                                                  openid: sOpenid,
                                                                  formid: formid,
                                                                },
                                                                header: {
                                                                  'Content-Type': 'application/x-www-form-urlencoded'
                                                                },
                                                                method: 'POST',
                                                                success: function(res) {
                                                                  if (res.data.status == 'success') {
                                                                    wx.showToast({
                                                                      title: '提交成功',
                                                                    })
                                                                    wx.reLaunch({
                                                                      url: '/pages/home/home',
                                                                    })
                                                                  } else {
                                                                    wx.showModal({
                                                                      title: '提示',
                                                                      content: 'FormId更新失败',
                                                                      showCancel: false,
                                                                      confirmText: '确定'
                                                                    })
                                                                  }
                                                                }
                                                              })
                                                            }
                                                          })
                                                        } else {
                                                          wx.showModal({
                                                            title: '提示',
                                                            content: '上传失败，请检查网络',
                                                            showCancel: false,
                                                          })
                                                        }
                                                      }
                                                    })
                                                  }
                                                }
                                              })
                                            }
                                          }
                                        }
                                      })
                                    }
                                  }
                                  if (type == 'd') {
                                    if (start == '' || end == '' || bName == '' || bOpenid == '' || bPhone == '' || reason == '') {
                                      wx.showModal({
                                        title: '提示',
                                        content: '请填写完整\n并检查输入班主任或任课教师姓名后点击回车在搜索结果中选中教师并确定',
                                        showCancel: false,
                                        confirmText: '确定'
                                      })
                                    } else {
                                      wx.showModal({
                                        title: '提示',
                                        content: '是否提交\n提交后不可修改',
                                        showCancel: true,
                                        success: function(res) {
                                          if (res.confirm) {
                                            wx.showLoading({
                                              title: '提交中',
                                            })
                                            if (isUpload == false) {
                                              wx.request({
                                                url: reqAPI + '/ask',
                                                data: {
                                                  id: id,
                                                  type: type,
                                                  s_openid: sOpenid,
                                                  name: name,
                                                  male: male,
                                                  stuid: stuid,
                                                  academy: academy,
                                                  class: stuClass,
                                                  start: start,
                                                  end: end,
                                                  remark: 'none',
                                                  reason: reason,
                                                  reason_img: 'none',
                                                  r_name: 'none',
                                                  r_openid: 'none',
                                                  r_phone: 'none',
                                                  b_name: bName,
                                                  b_openid: bOpenid,
                                                  b_phone: bPhone,
                                                  b_result: 'none',
                                                  b_refuse_reason: 'none',
                                                  l_name: 'none',
                                                  l_openid: 'none',
                                                  l_phone: 'none',
                                                  l_result: 'none',
                                                  l_refuse_reason: 'none',
                                                  s_phone: sPhone,
                                                },
                                                header: {
                                                  'Content-Type': 'application/x-www-form-urlencoded'
                                                },
                                                method: 'POST',
                                                success: function(res) {
                                                  console.log(res.data)
                                                  wx.hideLoading()
                                                  wx.request({
                                                    url: reqAPI + '/smsapprove',
                                                    data: {
                                                      phone: bPhone,
                                                      class: stuClass,
                                                      name: name,
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
                                                          content: '短信通知失败\n请稍后重试',
                                                          showCancel: false,
                                                          confirmText: '确定'
                                                        })
                                                      }
                                                    }
                                                  })
                                                  wx.request({
                                                    url: reqAPI + '/updatefid',
                                                    data: {
                                                      openid: sOpenid,
                                                      formid: formid,
                                                    },
                                                    header: {
                                                      'Content-Type': 'application/x-www-form-urlencoded'
                                                    },
                                                    method: 'POST',
                                                    success: function(res) {
                                                      if (res.data.status == 'success') {
                                                        wx.showToast({
                                                          title: '提交成功',
                                                        })
                                                        wx.reLaunch({
                                                          url: '/pages/home/home',
                                                        })
                                                      } else {
                                                        wx.showModal({
                                                          title: '提示',
                                                          content: 'FormId更新失败',
                                                          showCancel: false,
                                                          confirmText: '确定'
                                                        })
                                                      }
                                                    }
                                                  })
                                                }
                                              })
                                            } else {
                                              wx.showModal({
                                                title: '重要提示',
                                                content: '选择图片后由于原时间已失效，需要‘重新设置’开始时间及结束时间，否则提交后信息有误',
                                                showCancel: true,
                                                confirmText: '确认无误',
                                                cancelText: '修改时间',
                                                success: function(res) {
                                                  if (res.cancel) {
                                                    wx.hideLoading()
                                                  }
                                                  if (res.confirm) {
                                                    wx.uploadFile({
                                                      url: reqAPI + '/uploadcer?id=' + id,
                                                      filePath: imgpath,
                                                      name: 'certificate',
                                                      header: {
                                                        "Content-Type": "multipart/form-data"
                                                      },
                                                      method: 'GET',
                                                      success(res) {
                                                        console.log(res)
                                                        if (res.statusCode == 200) {
                                                          wx.request({
                                                            url: reqAPI + '/ask',
                                                            data: {
                                                              id: id,
                                                              type: type,
                                                              s_openid: sOpenid,
                                                              name: name,
                                                              male: male,
                                                              stuid: stuid,
                                                              academy: academy,
                                                              class: stuClass,
                                                              start: start,
                                                              end: end,
                                                              remark: 'none',
                                                              reason: reason,
                                                              reason_img: 'https://www.enjfun.com/img/cloudholiday/certificate/' + id + '_cer.jpg',
                                                              r_name: 'none',
                                                              r_openid: 'none',
                                                              r_phone: 'none',
                                                              b_name: bName,
                                                              b_openid: bOpenid,
                                                              b_phone: bPhone,
                                                              b_result: 'none',
                                                              b_refuse_reason: 'none',
                                                              l_name: 'none',
                                                              l_openid: 'none',
                                                              l_phone: 'none',
                                                              l_result: 'none',
                                                              l_refuse_reason: 'none',
                                                              s_phone: sPhone,
                                                            },
                                                            header: {
                                                              'Content-Type': 'application/x-www-form-urlencoded'
                                                            },
                                                            method: 'POST',
                                                            success: function(res) {
                                                              console.log(res.data)
                                                              wx.hideLoading()
                                                              wx.request({
                                                                url: reqAPI + '/smsapprove',
                                                                data: {
                                                                  phone: bPhone,
                                                                  class: stuClass,
                                                                  name: name,
                                                                },
                                                                header: {
                                                                  'Content-Type': 'application/x-www-form-urlencoded'
                                                                },
                                                                method: 'POST',
                                                                success: function(res) {
                                                                  if (res.data.status == 'success') {
                                                                    wx.showToast({
                                                                      title: '提交成功',
                                                                    })
                                                                    wx.reLaunch({
                                                                      url: '/pages/home/home',
                                                                    })
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
                                                              wx.request({
                                                                url: reqAPI + '/updatefid',
                                                                data: {
                                                                  openid: sOpenid,
                                                                  formid: formid,
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
                                                                      content: 'FormId更新失败',
                                                                      showCancel: false,
                                                                      confirmText: '确定'
                                                                    })
                                                                  }
                                                                }
                                                              })
                                                            }
                                                          })
                                                        } else {
                                                          wx.showModal({
                                                            title: '提示',
                                                            content: '上传失败，请检查网络',
                                                            showCancel: false,
                                                          })
                                                        }
                                                      }
                                                    })
                                                  }
                                                }
                                              })
                                            }
                                          }
                                        }
                                      })
                                    }
                                  }
                                  if (type == 'h') {
                                    wx.request({
                                      url: reqAPI + '/queryisholiday',
                                      header: {
                                        'Content-Type': 'application/json'
                                      },
                                      method: 'GET',
                                      success: function(res) {
                                        var address = res.data.results.remark
                                        if (res.data.results.isholiday == 't') {
                                          if (remark == '' || start == '' || end == '' || bName == '' || bOpenid == '' || bPhone == '' || reason == '') {
                                            wx.showModal({
                                              title: '提示',
                                              content: '请填写完整\n并检查输入班主任或任课教师姓名后点击回车在搜索结果中选中教师并确定',
                                              showCancel: false,
                                              confirmText: '确定'
                                            })
                                          } else {
                                            wx.showModal({
                                              title: '提示',
                                              content: '是否提交\n提交后不可修改',
                                              showCancel: true,
                                              success: function(res) {
                                                if (res.confirm) {
                                                  wx.showLoading({
                                                    title: '提交中',
                                                  })
                                                  wx.request({
                                                    url: reqAPI + '/askh',
                                                    data: {
                                                      id: id,
                                                      type: address,
                                                      s_openid: sOpenid,
                                                      name: name,
                                                      male: male,
                                                      stuid: stuid,
                                                      academy: academy,
                                                      class: stuClass,
                                                      start: start,
                                                      end: end,
                                                      remark: remark,
                                                      reason: reason,
                                                      b_name: bName,
                                                      b_openid: bOpenid,
                                                      b_phone: bPhone,
                                                      b_result: 'none',
                                                      b_refuse_reason: 'none',
                                                      s_phone: sPhone,
                                                    },
                                                    header: {
                                                      'Content-Type': 'application/x-www-form-urlencoded'
                                                    },
                                                    method: 'POST',
                                                    success: function(res) {
                                                      console.log(res.data)
                                                      wx.hideLoading()
                                                      wx.request({
                                                        url: reqAPI + '/updatefid',
                                                        data: {
                                                          openid: sOpenid,
                                                          formid: formid,
                                                        },
                                                        header: {
                                                          'Content-Type': 'application/x-www-form-urlencoded'
                                                        },
                                                        method: 'POST',
                                                        success: function(res) {
                                                          if (res.data.status == 'success') {
                                                            wx.showToast({
                                                              title: '提交成功',
                                                            })
                                                            wx.reLaunch({
                                                              url: '/pages/home/home',
                                                            })
                                                          } else {
                                                            wx.showModal({
                                                              title: '提示',
                                                              content: 'FormId更新失败',
                                                              showCancel: false,
                                                              confirmText: '确定'
                                                            })
                                                          }
                                                        }
                                                      })
                                                    }
                                                  })
                                                }
                                              }
                                            })
                                          }
                                        } else {
                                          wx.showModal({
                                            title: '提示',
                                            content: '非假期往返申请阶段',
                                            showCancel: false,
                                            confirmText: '确定'
                                          })
                                        }
                                      }
                                    })
                                  }
                                } else {
                                  wx.hideLoading()
                                  wx.showModal({
                                    title: '提示',
                                    content: '人脸不匹配，请确认是本人认证或在光线良好的环境重新验证',
                                    showCancel: false,
                                  })
                                  that.onShow()
                                }
                              }
                            })
                          }
                        }
                      })
                    }
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '检测失败，请重新尝试',
                  showCancel: false,
                })
              }
            }
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '获取用户信息失败\n请检查网络后重试',
        showCancel: false,
        confirmText: '确定'
      })
    }
  },
  faceauthCancel: function() {
    this.setData({
      faceauth_status: false,
    })
  },
  error: function (e) {
    wx.showModal({
      title: '提示',
      content: '相机授权失败，请点击右上角三个点——关于i云假——右上角三个点——设置中打开相机授权',
      showCancel: false,
    })
  },
  onPullDownRefresh: function() {
    var that = this
    that.onShow()
  }
})