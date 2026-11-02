// pages/profile/profile.js
Page({
  data: {
    userInfo: {},
    unreadCount: 0,
    cacheSize: '0KB'
  },

  onShow() {
    this.loadUserInfo();
    this.loadUnreadCount();
    this.getCacheSize();
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.verified) {
      wx.redirectTo({ url: '/pages/login/login' });
      return;
    }
    
    // 格式化注册时间
    if (userInfo.joinDate) {
      const date = new Date(userInfo.joinDate);
      userInfo.joinDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }
    
    this.setData({ userInfo });
  },

  loadUnreadCount() {
    const conversations = wx.getStorageSync('conversations') || [];
    const userInfo = wx.getStorageSync('userInfo');
    const myConvs = conversations.filter(conv => 
      conv.participants && conv.participants.includes(userInfo.id)
    );
    const totalUnread = myConvs.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
    this.setData({ unreadCount: totalUnread });
  },

  getCacheSize() {
    wx.getStorageInfo({
      success: (res) => {
        const sizeKB = (res.currentSize / 1024).toFixed(1);
        this.setData({ cacheSize: sizeKB + 'KB' });
      }
    });
  },

  // 跳转聊天列表
  goToChatList() {
    wx.navigateTo({ url: '/pages/chatList/chatList' });
  },

  // 查看学生证照片
  showStudentPhoto() {
    const userInfo = this.data.userInfo;
    if (userInfo.studentPhoto) {
      wx.showModal({
        title: '学生证照片',
        content: '您已上传学生证照片进行认证',
        confirmText: '查看',
        success: (res) => {
          if (res.confirm) {
            // 如果有真实图片路径可预览
            wx.showToast({ title: '照片已加密存储', icon: 'none' });
          }
        }
      });
    } else {
      wx.showToast({ title: '暂无学生证照片', icon: 'none' });
    }
  },

  showAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '1. 本平台仅限深圳大学丽湖校区师生使用\n2. 请遵守校纪校规，诚信交易\n3. 平台不对线下交易承担责任\n4. 请勿发布违规内容',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  showPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '我们仅收集您的昵称、学号、手机号用于身份验证。聊天记录加密存储，不会泄露给第三方。您可随时注销账号。',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '清除缓存不会影响您的订单和聊天记录，确定要清除吗？',
      success: (res) => {
        if (res.confirm) {
          // 保留重要数据
          const userInfo = wx.getStorageSync('userInfo');
          const orders = wx.getStorageSync('orders');
          const conversations = wx.getStorageSync('conversations');
          const messages = wx.getStorageSync('messages');
          
          wx.clearStorageSync();
          
          // 恢复重要数据
          wx.setStorageSync('userInfo', userInfo);
          wx.setStorageSync('orders', orders || []);
          wx.setStorageSync('conversations', conversations || []);
          wx.setStorageSync('messages', messages || []);
          
          wx.showToast({ title: '缓存已清除', icon: 'success' });
          this.getCacheSize();
        }
      }
    });
  },

  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          wx.reLaunch({ url: '/pages/login/login' });
        }
      }
    });
  }
});