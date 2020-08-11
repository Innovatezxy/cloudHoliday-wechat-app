const App = getApp()
var config = require('../../../utils/app/config.js')
var reqAPI = config.defaultURL

Page({
  data: {
    navH: 0,
    sms_wait: 60,
    check_view: false,
    stuid_status: false,
    class_status: false,
    code_status: false,
    code_time: '获取验证码',
    code_color: '#000',
    typeIndex: 0,
    typePick: ['请选择','领导','班主任','任课教师','班主任兼任课教师','学生'],
    typeValue: [undefined,'l','b','r','j','s'],
    genderIndex: 0,
    genderPick: ['请选择','男','女'],
    genderValue: [undefined,'男','女'],
    academyIndex: 0,
    academyPick: ['请选择', '研究生院', '计算机科学技术学院', '教育学院', '蒙古学学院', '文学院', '外国语学院', '历史文化学院', '旅游学院', '法政学院', '经济管理学院', '公共管理学院', '民族学人类学学院', '新闻传播学院', '数学科学学院', '物理与电子信息学院', '化学与环境科学学院', '生命科学与技术学院', '地理科学学院', '心理学院', '音乐学院', '体育学院', '美术学院', '国际设计艺术学院', '工艺美术学院', '国际交流学院', '马克思主义学院', '继续教育学院','二连国际学院'],
    academyValue: [undefined, '研究生院', '计算机科学技术学院', '教育学院', '蒙古学学院', '文学院', '外国语学院', '历史文化学院', '旅游学院', '法政学院', '经济管理学院', '公共管理学院', '民族学人类学学院', '新闻传播学院', '数学科学学院', '物理与电子信息学院', '化学与环境科学学院', '生命科学与技术学院', '地理科学学院', '心理学院', '音乐学院', '体育学院', '美术学院', '国际设计艺术学院', '工艺美术学院', '国际交流学院', '马克思主义学院', '继续教育学院', '二连国际学院'],
  },
  onLoad: function() {
    this.setData({
      navH: App.globalData.navH,
    })
  },
  typePicker: function(e) {
    this.setData({
      typeIndex: e.detail.value,
      type: this.data.typeValue[e.detail.value],
    })
    if (this.data.typeValue[e.detail.value] == 's'){
      this.setData({
        stuid_status: true,
        class_status: true,
      })
    } else {
      this.setData({
        stuid_status: false,
        class_status: false,
      })
    }
  },
  nameInput: function(e) {
    this.setData({
      name: e.detail.value,
    })
  },
  genderPicker: function(e) {
    this.setData({
      genderIndex: e.detail.value,
      gender: this.data.genderValue[e.detail.value]
    })
  },
  stuidInput: function(e) {
    this.setData({
      stuid: e.detail.value,
    })
  },
  academyPicker: function(e) {
    this.setData({
      academyIndex: e.detail.value,
      academy: this.data.academyValue[e.detail.value],
    })
  },
  classInput: function (e) {
    this.setData({
      stu_class: e.detail.value,
    })
  },
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  // 发送验证码
  smsCode: function() {
    var that = this
    if (this.data.phone == undefined || this.data.phone.length != 11){
      wx.showModal({
        title: '提示',
        content: '请正确填写手机号',
        showCancel: false,
        confirmText: '确定'
      })
    } else{
      var inter = setInterval(function () {
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
        url: reqAPI + '/smscode',
        data: {
          phone: this.data.phone,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          if(res.data.status == 'success'){
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
  codeInput: function(e) {
    this.setData({
      sms_code: e.detail.value,
    })
  },
  checkInput: function(e) {
    this.setData({
      check_pwd: e.detail.value,
    })
  },
  cancel: function() {
    this.setData({
      check_view: false,
    })
  },
  teacherSubmit: function() {
    var that = this
    var openid = wx.getStorageSync('openid')
    var unionid = wx.getStorageSync('unionid')
    var type = this.data.type
    var name = this.data.name
    var gender = this.data.gender
    var academy = this.data.academy
    var phone = this.data.phone

    if (this.data.check_pwd == '861573461' || this.data.check_pwd == '169177598' || this.data.check_pwd == '901573832'){
      if (type && name && gender && academy && phone && this.data.sms_code) {
        if (this.data.sms_code == that.data.sms_code_check) {
          wx.showModal({
            title: '注意',
            content: '是否注册\n信息一旦提交不可修改',
            confirmText: '确认',
            success: function(res) {
              if(res.confirm) {
                wx.request({
                  url: reqAPI + '/teacherreg',
                  data: {
                    openid: openid,
                    unionid: unionid,
                    type: type,
                    name: name,
                    male: gender,
                    academy: academy,
                    phone: phone,
                    number: 0,
                  },
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  method: 'POST',
                  success: function (res) {
                    if (res.data.status == 'success') {
                      wx.setStorageSync('user_type', type)
                      wx.showToast({
                        title: '注册成功',
                        duration: 1000,
                      })
                      wx.reLaunch({
                        url: '/pages/home/home',
                      })
                    } else {
                      wx.showToast({
                        title: '注册失败',
                        duration: 1000,
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
            content: '验证码错误',
            showCancel: false,
            confirmText: '确定'
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
    } else {
      wx.showModal({
        title: '提示',
        content: '验证失败',
        showCancel: false,
        confirmText: '确定'
      })
    }
  },
  stuSubmit: function(e) {
    var that = this
    var openid = wx.getStorageSync('openid')
    var unionid = wx.getStorageSync('unionid')
    var formid = e.detail.formId
    var type = this.data.type
    var name = this.data.name
    var gender = this.data.gender
    var stuid = this.data.stuid
    var academy = this.data.academy
    var stu_class = this.data.stu_class
    var phone = this.data.phone

    if (this.data.type == 'l' || this.data.type == 'b' || this.data.type == 'r' || this.data.type == 'j'){
      if (type && name && gender && academy && phone && this.data.sms_code) {
        if(this.data.sms_code == undefined || this.data.sms_code == ''){
          wx.showModal({
            title: '提示',
            content: '请填写验证码',
            showCancel: false,
            confirmText: '确定'
          })
        } else {
          if (this.data.sms_code == that.data.sms_code_check) {
            this.setData({
              check_view: true,
            })
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
          content: '请填写完整',
          showCancel: false,
          confirmText: '确定'
        })
      }
    } else {
      if (formid && type && name && gender && stuid && academy && stu_class && phone) {
        if (this.data.sms_code == undefined || this.data.sms_code == '') {
          wx.showModal({
            title: '提示',
            content: '请填写验证码',
            showCancel: false,
            confirmText: '确定'
          })
        } else {
          if (this.data.sms_code == that.data.sms_code_check) {
            wx.showModal({
              title: '注意',
              content: '信息一旦提交不可修改\n是否注册',
              confirmText: '确认',
              success: function (res) {
                if (res.confirm) {
                  wx.request({
                    url: reqAPI + '/stdreg',
                    data: {
                      openid: openid,
                      unionid: unionid,
                      formid: formid,
                      type: type,
                      name: name,
                      male: gender,
                      stuid: stuid,
                      academy: academy,
                      class: stu_class,
                      phone: phone,
                      number: 0,
                    },
                    header: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    success: function (res) {
                      if (res.data.status == 'success') {
                        wx.setStorageSync('user_type', type)
                        wx.showToast({
                          title: '注册成功',
                          duration: 1000,
                        })
                        wx.reLaunch({
                          url: '/pages/home/home',
                        })
                      } else {
                        wx.showToast({
                          title: '注册失败',
                          duration: 1000,
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
              content: '验证码错误',
              showCancel: false,
              confirmText: '确定'
            })
          }
        }  
      } else {
        wx.showModal({
          title: '提示',
          content: '请填写完整',
          showCancel: false,
          confirmText: '确定'
        })
      }
    }
  }
})