// pages/chatList/chatList.js
Page({
  data: {
    conversations: []
  },

  onShow() {
    this.loadConversations();
  },

  loadConversations() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.verified) {
      wx.redirectTo({ url: '/pages/login/login' });
      return;
    }
    
    const conversations = wx.getStorageSync('conversations') || [];
    const orders = wx.getStorageSync('orders') || [];
    
    // 过滤当前用户的会话
    let myConvs = conversations.filter(conv => 
      conv.participants && conv.participants.includes(userInfo.id)
    );
    
    // 补充对方信息和订单信息
    myConvs = myConvs.map(conv => {
      const otherId = conv.participants.find(pid => pid !== userInfo.id);
      // 从存储中获取对方用户信息（实际开发中应从数据库获取）
      const otherUser = this.getOtherUserInfo(otherId);
      
      // 获取关联订单
      const order = orders.find(o => o.id === conv.orderId);
      
      // 格式化时间
      const lastTimeFormatted = this.formatTime(conv.lastTime);
      
      return {
        ...conv,
        otherNickname: otherUser?.nickname || '同学',
        otherAvatar: otherUser?.avatar || otherUser?.nickname?.charAt(0) || '?',
        lastTimeFormatted,
        order,
        unreadCount: conv.unreadCount || 0
      };
    });
    
    // 按最后消息时间排序
    myConvs.sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));
    
    this.setData({ conversations: myConvs });
  },

  // 获取对方用户信息（实际应从后端获取）
  getOtherUserInfo(userId) {
    // 这里简单模拟，实际应从存储的 verifiedUsers 中获取
    const verifiedUsers = wx.getStorageSync('verifiedUsers') || [];
    const user = verifiedUsers.find(u => u.id === userId);
    if (user) return user;
    
    // 如果是当前登录用户的好友，可能需要从其他存储获取
    // 这里返回默认值
    return {
      nickname: '同学',
      avatar: '?'
    };
  },

  // 格式化时间显示
  formatTime(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // 今天内显示时间
    if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    
    // 昨天
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.getDate() === yesterday.getDate()) {
      return '昨天';
    }
    
    // 更早显示日期
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },

  goToChat(e) {
    const { conv } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/chat/chat?conversationId=${conv.conversationId}&otherNickname=${conv.otherNickname}`
    });
  },

  goToReceive() {
    wx.switchTab({ url: '/pages/receive/receive' });
  }
});