// index.js
Page({
  data: {
    recentTools: []
  },
  
  onLoad() {
    this.loadRecentTools()
  },
  
  onShow() {
    this.loadRecentTools()
  },
  
  loadRecentTools() {
    const recentTools = wx.getStorageSync('recentTools') || []
    this.setData({
      recentTools: recentTools.slice(0, 4)
    })
  },
  
  addRecentTool(tool) {
    let recentTools = wx.getStorageSync('recentTools') || []
    
    // 移除已存在的相同工具
    recentTools = recentTools.filter(item => item.url !== tool.url)
    
    // 添加到最前面
    recentTools.unshift(tool)
    
    // 只保留最近4个
    recentTools = recentTools.slice(0, 4)
    
    wx.setStorageSync('recentTools', recentTools)
  }
})