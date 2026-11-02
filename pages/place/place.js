Page({
  data: {
    // 订单类型
    orderType: 'express',
    orderTypeText: '快递代拿',
    
    // 物品描述
    description: '',
    
    // 取件地点
    pickupLocation: '',
    customPickup: '',
    finalPickupLocation: '',
    
    // 送达地点
    deliveryLocation: '',
    customDelivery: '',
    finalDeliveryLocation: '',
    
    // 私密信息
    pickupCode: '',
    roomNumber: '',
    contactPhone: '',
    
    // 价格
    price: '',
    
    // 时间设置
    waitTime: 30,
    expectedDelivery: '30',
    customDeliveryTime: '',
    finalExpectedDeliveryMinutes: 30,
    finalExpectedDelivery: '30分钟',
    expectedDeliveryWarning: '',
    
    // 备注
    remark: '',
    
    // 状态
    publishing: false,
    canPublish: false
  },

  onLoad() {
    this.checkLogin()
  },

  checkLogin() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo || !userInfo.verified) {
      wx.showModal({
        title: '提示',
        content: '请先完成认证登录',
        showCancel: false,
        success: () => {
          wx.redirectTo({ url: '/pages/login/login' })
        }
      })
      return false
    }
    return true
  },

  // 选择订单类型
  selectType(e) {
    const type = e.currentTarget.dataset.type
    const typeMap = {
      snack: '宵夜街代购',
      canteen: '食堂代购',
      express: '快递代拿',
      other: '其他'
    }
    this.setData({
      orderType: type,
      orderTypeText: typeMap[type]
    })
    this.checkCanPublish()
  },

  // 物品描述
  onDescriptionInput(e) {
    this.setData({ description: e.detail.value })
    this.checkCanPublish()
  },

  // 取件地点
  selectPickupLocation(e) {
    const location = e.currentTarget.dataset.loc
    this.setData({ 
      pickupLocation: location,
      customPickup: ''
    })
    this.updateFinalPickupLocation()
    this.checkCanPublish()
  },

  onCustomPickupInput(e) {
    this.setData({ 
      customPickup: e.detail.value,
      pickupLocation: ''
    })
    this.updateFinalPickupLocation()
    this.checkCanPublish()
  },

  updateFinalPickupLocation() {
    const { pickupLocation, customPickup } = this.data
    let finalLocation = ''
    
    if (pickupLocation && pickupLocation !== 'other') {
      finalLocation = pickupLocation + '宿舍楼'
    } else if (customPickup) {
      finalLocation = customPickup
    }
    this.setData({ finalPickupLocation: finalLocation })
  },

  // 送达地点
  selectDeliveryLocation(e) {
    const location = e.currentTarget.dataset.loc
    this.setData({ 
      deliveryLocation: location,
      customDelivery: ''
    })
    this.updateFinalDeliveryLocation()
    this.checkCanPublish()
  },

  onCustomDeliveryInput(e) {
    this.setData({ 
      customDelivery: e.detail.value,
      deliveryLocation: ''
    })
    this.updateFinalDeliveryLocation()
    this.checkCanPublish()
  },

  updateFinalDeliveryLocation() {
    const { deliveryLocation, customDelivery } = this.data
    let finalLocation = ''
    
    if (deliveryLocation && deliveryLocation !== 'other') {
      finalLocation = deliveryLocation + '宿舍楼'
    } else if (customDelivery) {
      finalLocation = customDelivery
    }
    this.setData({ finalDeliveryLocation: finalLocation })
  },

  // 私密信息
  onPickupCodeInput(e) {
    this.setData({ pickupCode: e.detail.value })
  },

  onRoomNumberInput(e) {
    this.setData({ roomNumber: e.detail.value })
  },

  onContactPhoneInput(e) {
    this.setData({ contactPhone: e.detail.value })
  },

  // 价格
  onPriceInput(e) {
    let value = e.detail.value
    if (value && value.includes('.')) {
      const parts = value.split('.')
      if (parts[1] && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].substring(0, 2)
      }
    }
    this.setData({ price: value })
    this.checkCanPublish()
  },

  selectPrice(e) {
    const price = e.currentTarget.dataset.price
    this.setData({ price: price.toString() })
    this.checkCanPublish()
  },

  // 等待时间
  onWaitTimeChange(e) {
    this.setData({ waitTime: e.detail.value })
    this.updateExpectedDeliveryWarning()
  },

  // 期望送达时间
  selectExpectedDelivery(e) {
    const time = e.currentTarget.dataset.time
    
    if (time === 'custom') {
      this.setData({ 
        expectedDelivery: 'custom',
        customDeliveryTime: '',
        finalExpectedDeliveryMinutes: 0,
        finalExpectedDelivery: ''
      })
      this.updateExpectedDeliveryWarning()
      return
    }
    
    const minutes = parseInt(time)
    const timeText = minutes + '分钟'
    
    this.setData({
      expectedDelivery: time,
      finalExpectedDeliveryMinutes: minutes,
      finalExpectedDelivery: timeText,
      customDeliveryTime: ''
    })
    
    this.updateExpectedDeliveryWarning()
    this.checkCanPublish()
  },

  onCustomDeliveryTimeInput(e) {
    let minutes = parseInt(e.detail.value)
    
    if (isNaN(minutes)) {
      this.setData({
        customDeliveryTime: e.detail.value,
        finalExpectedDeliveryMinutes: 0,
        finalExpectedDelivery: ''
      })
      this.updateExpectedDeliveryWarning()
      return
    }
    
    if (minutes < 5) minutes = 5
    if (minutes > 120) minutes = 120
    
    const timeText = minutes + '分钟'
    
    this.setData({
      customDeliveryTime: minutes.toString(),
      finalExpectedDeliveryMinutes: minutes,
      finalExpectedDelivery: timeText
    })
    
    this.updateExpectedDeliveryWarning()
    this.checkCanPublish()
  },

  updateExpectedDeliveryWarning() {
    const { waitTime, finalExpectedDeliveryMinutes } = this.data
    
    if (finalExpectedDeliveryMinutes === 0) {
      this.setData({ expectedDeliveryWarning: '' })
      return
    }
    
    let warning = ''
    if (finalExpectedDeliveryMinutes < waitTime) {
      warning = `期望送达时间(${finalExpectedDeliveryMinutes}分钟)小于等待接单时间(${waitTime}分钟)`
    }
    this.setData({ expectedDeliveryWarning: warning })
  },

  // 备注
  onRemarkInput(e) {
    this.setData({ remark: e.detail.value })
  },

  // 检查是否可以发布
  checkCanPublish() {
    const { description, finalPickupLocation, finalDeliveryLocation, price, finalExpectedDeliveryMinutes } = this.data
    const canPublish = description.trim().length > 0 && 
                       finalPickupLocation.trim().length > 0 && 
                       finalDeliveryLocation.trim().length > 0 && 
                       price && parseFloat(price) > 0 &&
                       finalExpectedDeliveryMinutes > 0
    
    this.setData({ canPublish })
  },

  // 发布订单
  publishOrder() {
    if (!this.data.canPublish || this.data.publishing) return
    
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    
    const {
      orderType,
      orderTypeText,
      description,
      finalPickupLocation,
      finalDeliveryLocation,
      pickupCode,
      roomNumber,
      contactPhone,
      price,
      waitTime,
      finalExpectedDeliveryMinutes,
      finalExpectedDelivery,
      remark
    } = this.data
    
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      wx.showToast({ title: '请输入有效价格', icon: 'none' })
      return
    }
    
    // 构建订单
    const newOrder = {
      id: 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      creatorId: userInfo.id,
      creatorNickname: userInfo.nickname,
      creatorPhone: userInfo.phone,
      
      orderType: orderType,
      orderTypeText: orderTypeText,
      description: description.trim(),
      pickupLocation: finalPickupLocation,
      deliveryLocation: finalDeliveryLocation,
      price: priceNum,
      waitMinutes: waitTime,
      expectedDeliveryMinutes: finalExpectedDeliveryMinutes,
      expectedDeliveryText: finalExpectedDelivery,
      remark: remark,
      status: 'waiting',
      createTime: new Date().toISOString(),
      expireTime: Date.now() + waitTime * 60 * 1000,
      takerId: null,
      takerNickname: null,
      takerPhone: null,
      takerAcceptTime: null,
      completeTime: null,
      
      privateInfo: {
        pickupCode: pickupCode || '',
        roomNumber: roomNumber || '',
        contactPhone: contactPhone || userInfo.phone || ''
      }
    }
    
    this.setData({ publishing: true })
    wx.showLoading({ title: '发布中...' })
    
    setTimeout(() => {
      try {
        let orders = wx.getStorageSync('orders') || []
        orders.unshift(newOrder)
        wx.setStorageSync('orders', orders)
        
        wx.hideLoading()
        wx.showToast({ title: '发布成功！', icon: 'success' })
        
        this.setData({
          description: '',
          pickupCode: '',
          roomNumber: '',
          price: '',
          remark: '',
          publishing: false
        })
        
        setTimeout(() => {
          wx.switchTab({ url: '/pages/home/home' })
        }, 1500)
        
      } catch (err) {
        wx.hideLoading()
        wx.showToast({ title: '发布失败', icon: 'none' })
        this.setData({ publishing: false })
      }
    }, 500)
  }
})