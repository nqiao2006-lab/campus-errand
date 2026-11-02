App({
  globalData: {
    userInfo: null,        // 用户基本信息
    auditStatus: null,     // 审核状态: 'pending', 'approved', 'rejected'
    token: null            // 用户认证令牌
  },
  
  async onLaunch() {
    // 检查本地是否有登录凭证
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    
    if (token && userInfo) {
      // 有本地记录，验证token是否有效以及审核状态
      await this.checkAuditStatus(token)
    } else {
      // 无本地记录，跳转登录页
      this.navigateToLogin()
    }
  },
  
  // 检查审核状态
  async checkAuditStatus(token) {
    try {
      const res = await wx.request({
        url: 'https://your-api.com/user/audit-status',
        method: 'GET',
        header: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (res.data.code === 200) {
        const auditStatus = res.data.data.auditStatus
        
        switch(auditStatus) {
          case 'approved':
            // 审核通过，更新全局数据
            this.globalData.auditStatus = 'approved'
            this.globalData.userInfo = res.data.data.userInfo
            this.globalData.token = token
            break
            
          case 'pending':
            // 审核中，显示等待页面
            this.globalData.auditStatus = 'pending'
            this.navigateToAuditPending()
            break
            
          case 'rejected':
            // 审核被拒，清除本地记录，重新登录
            this.clearLocalData()
            this.navigateToLogin()
            break
        }
      } else {
        // token无效，重新登录
        this.clearLocalData()
        this.navigateToLogin()
      }
    } catch (error) {
      console.error('检查审核状态失败', error)
      this.navigateToLogin()
    }
  },
  
  // 保存用户信息到本地和后台
  async saveUserInfo(userData) {
    try {
      // 1. 发送到后台保存
      const res = await wx.request({
        url: 'https://your-api.com/user/submit',
        method: 'POST',
        data: {
          username: userData.username,
          phone: userData.phone,
          email: userData.email,
          // 其他需要提交的字段
        }
      })
      
      if (res.data.code === 200) {
        const { token, auditStatus } = res.data.data
        
        // 2. 保存到本地存储
        wx.setStorageSync('token', token)
        wx.setStorageSync('userInfo', {
          username: userData.username,
          phone: userData.phone
        })
        
        // 3. 更新全局数据
        this.globalData.token = token
        this.globalData.userInfo = userData
        this.globalData.auditStatus = auditStatus
        
        // 4. 跳转到审核等待页面
        this.navigateToAuditPending()
        
        return { success: true }
      } else {
        throw new Error(res.data.message)
      }
    } catch (error) {
      console.error('保存用户信息失败', error)
      return { success: false, error: error.message }
    }
  },
  
  // 清除本地数据
  clearLocalData() {
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    this.globalData.token = null
    this.globalData.userInfo = null
    this.globalData.auditStatus = null
  },
  
  // 跳转到登录页
  navigateToLogin() {
    wx.redirectTo({
      url: '/pages/login/login'
    })
  },
  
  // 跳转到审核等待页
  navigateToAuditPending() {
    wx.redirectTo({
      url: '/pages/audit-pending/audit-pending'
    })
  }
})