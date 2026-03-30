// app.js
App({
  onLaunch() {
    // 初始化云开发环境
    if (wx.cloud) {
      wx.cloud.init({
        env: 'your-cloud-env-id',
        traceUser: true
      })
    }
    
    // 读取本地存储的设置
    const settings = wx.getStorageSync('settings')
    if (settings) {
      this.globalData.settings = settings
    }
  },
  
  onShow() {
    console.log('小程序启动')
  },
  
  globalData: {
    userInfo: null,
    settings: {
      theme: 'light',
      language: 'zh-CN'
    }
  }
})