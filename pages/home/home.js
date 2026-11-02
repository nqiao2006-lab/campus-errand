// pages/home/home.js
Page({
  data: {
    userInfo: null,
    pendingOrdersCount: 0,
    recentOrders: []
  },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo || !userInfo.verified) {
      wx.redirectTo({ url: '/pages/login/login' });
      return;
    }
    this.setData({ userInfo });
    this.loadData();
  },

  loadData() {
    const orders = wx.getStorageSync('orders') || [];
    const waitingOrders = orders.filter(o => o.status === 'waiting');
    const recent = orders.slice(0, 3);
    this.setData({
      pendingOrdersCount: waitingOrders.length,
      recentOrders: recent
    });
  },

  goToPlace() {
    wx.switchTab({ url: '/pages/place/place' });
  },

  goToReceive() {
    wx.switchTab({ url: '/pages/receive/receive' });
  },

  goToChatList() {
    wx.navigateTo({ url: '/pages/chatList/chatList' });
  }
});