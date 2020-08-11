const config = require('utils/app/config.js')
const reqAPI = config.defaultURL

//app.js
App({
  onLaunch: function () {
    // 获取导航栏navH高度
    wx.getSystemInfo({
      success: res => {
        //导航栏高度
        this.globalData.navH = res.statusBarHeight;
      }, fail(err) {
        console.log(err);
      }
    })
    
    var that = this
    var admin_id = wx.getStorageSync('admin_id')
    var admin_pwd = wx.getStorageSync('admin_pwd')
    var openid = wx.getStorageSync('openid')
    var timestamps = Date.parse(new Date()) / 1000
    console.log(openid)
    if(admin_id && admin_pwd){
      
    } else {
      if (openid) {
        wx.request({
          url: reqAPI + '/getatk',
          header: {
            'Content-Type': 'application/json'
          },
          method: 'GET',
          success: function(res) {
            var sub = timestamps - res.data.results.endtime
            if(sub >= 7000){
              wx.request({
                url: reqAPI + '/newatk',
                header: {
                  'Content-Type': 'application/json'
                },
                method: 'GET',
                success: function (res) {
                  that.globalData.access_token = res.data.results.token
                  wx.request({
                    url: reqAPI + '/updateatk',
                    header: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                      access_token: res.data.results.access_token,
                      endtime: timestamps,
                    },
                    method: 'POST',
                    success: function (res) {
                      if(res.data.status == 'success'){
                        console.log('update success')
                      }
                    }
                  })
                }
              })
            } else {
              console.log('working')
              that.globalData.access_token = res.data.results.token
            }
          }
        })
      } else {
        wx.redirectTo({
          url: '/pages/routers/wellcome/wellcome',
        })
      }
    }
  },
  globalData: {
    userInfo: null,
    navH: 0,
    name: '---',
    type: 's',
    access_token: '',
  }
})