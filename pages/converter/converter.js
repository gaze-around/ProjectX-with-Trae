// converter.js
Page({
  data: {
    categories: [
      { id: 'length', name: '长度' },
      { id: 'weight', name: '重量' },
      { id: 'temperature', name: '温度' },
      { id: 'time', name: '时间' },
      { id: 'volume', name: '体积' }
    ],
    currentCategory: 'length',
    inputValue: '1',
    outputValue: '',
    fromUnit: '米',
    toUnit: '厘米',
    fromUnits: [],
    toUnits: [],
    history: []
  },
  
  unitConfig: {
    length: {
      units: ['米', '厘米', '毫米', '千米', '英寸', '英尺', '码', '英里'],
      base: '米',
      factors: {
        '米': 1,
        '厘米': 100,
        '毫米': 1000,
        '千米': 0.001,
        '英寸': 39.3701,
        '英尺': 3.28084,
        '码': 1.09361,
        '英里': 0.000621371
      }
    },
    weight: {
      units: ['千克', '克', '毫克', '吨', '磅', '盎司'],
      base: '千克',
      factors: {
        '千克': 1,
        '克': 1000,
        '毫克': 1000000,
        '吨': 0.001,
        '磅': 2.20462,
        '盎司': 35.274
      }
    },
    temperature: {
      units: ['摄氏度', '华氏度', '开尔文'],
      convert: function(value, fromUnit, toUnit) {
        if (fromUnit === toUnit) return value;
        
        let celsius;
        if (fromUnit === '摄氏度') {
          celsius = value;
        } else if (fromUnit === '华氏度') {
          celsius = (value - 32) * 5 / 9;
        } else if (fromUnit === '开尔文') {
          celsius = value - 273.15;
        }
        
        if (toUnit === '摄氏度') {
          return celsius;
        } else if (toUnit === '华氏度') {
          return celsius * 9 / 5 + 32;
        } else if (toUnit === '开尔文') {
          return celsius + 273.15;
        }
      }
    },
    time: {
      units: ['秒', '分钟', '小时', '天', '周', '月', '年'],
      base: '秒',
      factors: {
        '秒': 1,
        '分钟': 1/60,
        '小时': 1/3600,
        '天': 1/86400,
        '周': 1/604800,
        '月': 1/2592000,
        '年': 1/31536000
      }
    },
    volume: {
      units: ['升', '毫升', '立方米', '立方厘米', '加仑', '夸脱', '品脱', '杯'],
      base: '升',
      factors: {
        '升': 1,
        '毫升': 1000,
        '立方米': 0.001,
        '立方厘米': 1000,
        '加仑': 0.264172,
        '夸脱': 1.05669,
        '品脱': 2.11338,
        '杯': 4.22675
      }
    }
  },
  
  onLoad() {
    this.initCategory('length')
    this.addToRecent()
  },
  
  addToRecent() {
    const tool = {
      name: '单位转换',
      url: '../converter/converter',
      icon: '../../images/converter.png'
    }
    
    const indexPage = getCurrentPages()[0]
    if (indexPage && indexPage.addRecentTool) {
      indexPage.addRecentTool(tool)
    }
  },
  
  initCategory(category) {
    const config = this.unitConfig[category]
    this.setData({
      currentCategory: category,
      fromUnits: config.units,
      toUnits: config.units,
      fromUnit: config.units[0],
      toUnit: config.units[1]
    })
    this.convertValue()
  },
  
  selectCategory(e) {
    const category = e.currentTarget.dataset.id
    this.initCategory(category)
  },
  
  onInputChange(e) {
    const value = e.detail.value
    this.setData({ inputValue: value })
    this.convertValue()
  },
  
  onFromUnitChange(e) {
    const index = e.detail.value
    const fromUnit = this.data.fromUnits[index]
    this.setData({ fromUnit })
    this.convertValue()
  },
  
  onToUnitChange(e) {
    const index = e.detail.value
    const toUnit = this.data.toUnits[index]
    this.setData({ toUnit })
    this.convertValue()
  },
  
  swapUnits() {
    const { fromUnit, toUnit } = this.data
    this.setData({ fromUnit: toUnit, toUnit: fromUnit })
    this.convertValue()
  },
  
  convertValue() {
    const { currentCategory, inputValue, fromUnit, toUnit } = this.data
    const config = this.unitConfig[currentCategory]
    
    if (!inputValue || isNaN(inputValue)) {
      this.setData({ outputValue: '' })
      return
    }
    
    const value = parseFloat(inputValue)
    let result
    
    if (currentCategory === 'temperature') {
      result = config.convert(value, fromUnit, toUnit)
    } else {
      const baseValue = value / config.factors[fromUnit]
      result = baseValue * config.factors[toUnit]
    }
    
    const formattedResult = parseFloat(result.toFixed(6))
    this.setData({ outputValue: formattedResult.toString() })
    this.addToHistory(value, fromUnit, formattedResult, toUnit)
  },
  
  addToHistory(inputValue, fromUnit, outputValue, toUnit) {
    let history = wx.getStorageSync('conversionHistory') || []
    
    const historyItem = {
      inputValue,
      fromUnit,
      outputValue,
      toUnit,
      timestamp: new Date().getTime()
    }
    
    history.unshift(historyItem)
    history = history.slice(0, 10)
    
    wx.setStorageSync('conversionHistory', history)
    this.setData({ history })
  },
  
  onShow() {
    const history = wx.getStorageSync('conversionHistory') || []
    this.setData({ history })
  }
})