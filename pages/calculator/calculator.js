// calculator.js
Page({
  data: {
    display: '0',
    history: '',
    firstOperand: null,
    operator: null,
    waitingForSecondOperand: false
  },
  
  onLoad() {
    // 添加到最近使用
    this.addToRecent()
  },
  
  addToRecent() {
    const app = getApp()
    const tool = {
      name: '计算器',
      url: '../calculator/calculator',
      icon: '../../images/calculator.png'
    }
    
    // 调用首页的方法添加到最近使用
    const indexPage = getCurrentPages()[0]
    if (indexPage && indexPage.addRecentTool) {
      indexPage.addRecentTool(tool)
    }
  },
  
  clear() {
    this.setData({
      display: '0',
      history: '',
      firstOperand: null,
      operator: null,
      waitingForSecondOperand: false
    })
  },
  
  backspace() {
    const display = this.data.display
    if (display.length === 1) {
      this.setData({ display: '0' })
    } else {
      this.setData({ display: display.slice(0, -1) })
    }
  },
  
  toggleSign() {
    const display = this.data.display
    if (display === '0') return
    
    if (display.startsWith('-')) {
      this.setData({ display: display.slice(1) })
    } else {
      this.setData({ display: '-' + display })
    }
  },
  
  appendNumber(e) {
    const num = e.currentTarget.dataset.num
    const display = this.data.display
    const waitingForSecondOperand = this.data.waitingForSecondOperand
    
    if (waitingForSecondOperand) {
      this.setData({
        display: num,
        waitingForSecondOperand: false
      })
    } else {
      if (display === '0' && num !== '.') {
        this.setData({ display: num })
      } else {
        this.setData({ display: display + num })
      }
    }
  },
  
  appendDecimal() {
    const display = this.data.display
    if (!display.includes('.')) {
      this.setData({ display: display + '.' })
    }
  },
  
  appendOperator(e) {
    const op = e.currentTarget.dataset.op
    const display = this.data.display
    const firstOperand = this.data.firstOperand
    const operator = this.data.operator
    
    if (firstOperand !== null && operator !== null && !this.data.waitingForSecondOperand) {
      const result = this.calculate(firstOperand, parseFloat(display), operator)
      this.setData({
        display: result.toString(),
        firstOperand: result,
        history: firstOperand + ' ' + this.getOperatorSymbol(operator) + ' ' + display,
        waitingForSecondOperand: true,
        operator: op
      })
    } else {
      this.setData({
        firstOperand: parseFloat(display),
        history: display + ' ' + this.getOperatorSymbol(op),
        waitingForSecondOperand: true,
        operator: op
      })
    }
  },
  
  calculate() {
    const firstOperand = this.data.firstOperand
    const display = this.data.display
    const operator = this.data.operator
    
    if (firstOperand === null || operator === null) return
    
    const result = this.calculate(firstOperand, parseFloat(display), operator)
    this.setData({
      display: result.toString(),
      history: firstOperand + ' ' + this.getOperatorSymbol(operator) + ' ' + display + ' =',
      firstOperand: null,
      operator: null,
      waitingForSecondOperand: false
    })
  },
  
  calculate(a, b, op) {
    switch (op) {
      case '+':
        return a + b
      case '-':
        return a - b
      case '*':
        return a * b
      case '/':
        return a / b
      default:
        return b
    }
  },
  
  getOperatorSymbol(op) {
    switch (op) {
      case '+':
        return '+'
      case '-':
        return '-'
      case '*':
        return '×'
      case '/':
        return '÷'
      default:
        return op
    }
  }
})