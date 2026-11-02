Page({
  data: {
    activeTab: 'myOrders',
    myOrders: [],
    myTaken: []
  },

  onShow: function() {
    this.loadOrders();
  },

  loadOrders: function() {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    
    console.log('加载订单，当前用户:', userInfo);
    
    if (!userInfo || !userInfo.verified) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    var orders = wx.getStorageSync('orders') || [];
    console.log('所有订单:', orders);
    
    var myOrders = [];
    var myTaken = [];
    
    for (var i = 0; i < orders.length; i++) {
      var order = orders[i];
      // 我发布的订单
      if (order.creatorId === userInfo.id) {
        myOrders.push(order);
      }
      // 我接的订单（排除已取消的）
      if (order.takerId === userInfo.id && order.status !== 'canceled') {
        myTaken.push(order);
      }
    }
    
    console.log('我发布的:', myOrders);
    console.log('我接的:', myTaken);
    
    that.setData({
      myOrders: myOrders,
      myTaken: myTaken
    });
  },

  switchTab: function(e) {
    var tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  cancelOrder: function(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '取消订单',
      content: '确定要取消这个订单吗？',
      success: function(res) {
        if (res.confirm) {
          var orders = wx.getStorageSync('orders') || [];
          for (var i = 0; i < orders.length; i++) {
            if (orders[i].id === orderId) {
              orders[i].status = 'canceled';
              break;
            }
          }
          wx.setStorageSync('orders', orders);
          wx.showToast({
            title: '已取消',
            icon: 'success'
          });
          that.loadOrders();
        }
      }
    });
  },

  completeOrder: function(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '完成订单',
      content: '确认已完成服务吗？',
      success: function(res) {
        if (res.confirm) {
          var orders = wx.getStorageSync('orders') || [];
          for (var i = 0; i < orders.length; i++) {
            if (orders[i].id === orderId) {
              orders[i].status = 'completed';
              break;
            }
          }
          wx.setStorageSync('orders', orders);
          wx.showToast({
            title: '订单已完成',
            icon: 'success'
          });
          that.loadOrders();
        }
      }
    });
  },

  goToPlace: function() {
    wx.switchTab({
      url: '/pages/place/place'
    });
  },

  goToReceive: function() {
    wx.switchTab({
      url: '/pages/receive/receive'
    });
  }
});