// settings.js
Page({
  data: {
    darkMode: false
  },
  
  onLoad() {
    // 读取深色模式设置
    const darkMode = wx.getStorageSync('darkMode') || false
    this.setData({ darkMode })
  },
  
  clearHistory() {
    wx.showModal({
      title: '清除历史记录',
      content: '确定要清除所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除所有历史记录
          wx.removeStorageSync('recentTools')
          wx.removeStorageSync('conversionHistory')
          wx.removeStorageSync('timerHistory')
          
          wx.showToast({
            title: '历史记录已清除',
            icon: 'success'
          })
        }
      }
    })
  },
  
  toggleDarkMode(e) {
    const darkMode = e.detail.value
    this.setData({ darkMode })
    
    // 保存设置
    wx.setStorageSync('darkMode', darkMode)
    
    // 这里可以添加深色模式的实际切换逻辑
    if (darkMode) {
      wx.showToast({
        title: '已开启深色模式',
        icon: 'success'
      })
    } else {
      wx.showToast({
        title: '已关闭深色模式',
        icon: 'success'
      })
    }
  },
  
  showAbout() {
    wx.showModal({
      title: '关于我们',
      content: '实用工具小程序 v1.0.0\n\n提供计算器、单位转换、倒计时等实用功能。\n\n© 2026 实用工具',
      showCancel: false
    })
  },
  
  showPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '我们尊重并保护用户隐私，不会收集任何个人信息。所有数据仅存储在本地设备上。',
      showCancel: false
    })
  }
})