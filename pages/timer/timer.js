// timer.js
Page({
  data: {
    hours: '0',
    minutes: '0',
    seconds: '0',
    timeDisplay: '00:00:00',
    isRunning: false,
    isPaused: false,
    remainingTime: 0,
    timerInterval: null,
    history: []
  },
  
  onLoad() {
    this.addToRecent()
    this.loadHistory()
  },
  
  addToRecent() {
    const tool = {
      name: '倒计时',
      url: '../timer/timer',
      icon: '../../images/timer.png'
    }
    
    const indexPage = getCurrentPages()[0]
    if (indexPage && indexPage.addRecentTool) {
      indexPage.addRecentTool(tool)
    }
  },
  
  loadHistory() {
    const history = wx.getStorageSync('timerHistory') || []
    this.setData({ history })
  },
  
  onHoursChange(e) {
    const value = e.detail.value
    this.setData({ hours: value || '0' })
    this.updateTimeDisplay()
  },
  
  onMinutesChange(e) {
    const value = e.detail.value
    this.setData({ minutes: value || '0' })
    this.updateTimeDisplay()
  },
  
  onSecondsChange(e) {
    const value = e.detail.value
    this.setData({ seconds: value || '0' })
    this.updateTimeDisplay()
  },
  
  updateTimeDisplay() {
    const { hours, minutes, seconds } = this.data
    const display = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`
    this.setData({ timeDisplay: display })
  },
  
  padZero(num) {
    return num.toString().padStart(2, '0')
  },
  
  setPreset(e) {
    const { hours, minutes, seconds } = e.currentTarget.dataset
    this.setData({
      hours,
      minutes,
      seconds
    })
    this.updateTimeDisplay()
  },
  
  startTimer() {
    const { hours, minutes, seconds } = this.data
    const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
    
    if (totalSeconds <= 0) {
      wx.showToast({
        title: '请设置有效时间',
        icon: 'none'
      })
      return
    }
    
    this.setData({
      isRunning: true,
      isPaused: false,
      remainingTime: totalSeconds
    })
    
    this.startCountdown()
    this.addHistoryItem('开始')
  },
  
  startCountdown() {
    this.setData({
      timerInterval: setInterval(() => {
        this.setData({
          remainingTime: this.data.remainingTime - 1
        })
        
        if (this.data.remainingTime <= 0) {
          this.stopTimer()
          this.addHistoryItem('完成')
          wx.showModal({
            title: '倒计时结束',
            content: '时间到！',
            showCancel: false
          })
        } else {
          this.updateDisplayFromRemaining()
        }
      }, 1000)
    })
  },
  
  updateDisplayFromRemaining() {
    const totalSeconds = this.data.remainingTime
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    const display = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`
    this.setData({
      timeDisplay: display,
      hours: hours.toString(),
      minutes: minutes.toString(),
      seconds: seconds.toString()
    })
  },
  
  pauseTimer() {
    clearInterval(this.data.timerInterval)
    this.setData({
      isPaused: true
    })
    this.addHistoryItem('暂停')
  },
  
  resumeTimer() {
    this.startCountdown()
    this.setData({
      isPaused: false
    })
    this.addHistoryItem('继续')
  },
  
  stopTimer() {
    clearInterval(this.data.timerInterval)
    this.setData({
      isRunning: false,
      isPaused: false
    })
  },
  
  resetTimer() {
    this.stopTimer()
    this.setData({
      hours: '0',
      minutes: '0',
      seconds: '0',
      timeDisplay: '00:00:00',
      remainingTime: 0
    })
  },
  
  addHistoryItem(status) {
    let history = wx.getStorageSync('timerHistory') || []
    
    const historyItem = {
      time: new Date().toLocaleString(),
      status
    }
    
    history.unshift(historyItem)
    history = history.slice(0, 10)
    
    wx.setStorageSync('timerHistory', history)
    this.setData({ history })
  },
  
  onUnload() {
    if (this.data.timerInterval) {
      clearInterval(this.data.timerInterval)
    }
  }
})