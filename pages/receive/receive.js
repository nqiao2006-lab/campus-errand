Page({
  data: {
    waitingOrders: []
  },

  onShow: function() {
    this.loadOrders();
  },

  loadOrders: function() {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    
    if (!userInfo || !userInfo.verified) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    var orders = wx.getStorageSync('orders') || [];
    var waitingOrders = [];
    
    for (var i = 0; i < orders.length; i++) {
      var order = orders[i];
      if (order.status === 'waiting' && order.creatorId !== userInfo.id) {
        order.publisherNickname = order.creatorNickname;
        waitingOrders.push(order);
      }
    }
    
    that.setData({
      waitingOrders: waitingOrders
    });
  },

  takeOrder: function(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    var userInfo = wx.getStorageSync('userInfo');
    var orders = wx.getStorageSync('orders') || [];
    var orderIndex = -1;
    
    for (var i = 0; i < orders.length; i++) {
      if (orders[i].id === orderId) {
        orderIndex = i;
        break;
      }
    }
    
    if (orderIndex === -1 || orders[orderIndex].status !== 'waiting') {
      wx.showToast({
        title: '订单已被接走',
        icon: 'none'
      });
      return;
    }
    
    wx.showModal({
      title: '确认接单',
      content: '确定要接这个订单吗？接单后可通过聊天联系对方。',
      success: function(res) {
        if (res.confirm) {
          orders[orderIndex].status = 'accepted';
          orders[orderIndex].takerId = userInfo.id;
          orders[orderIndex].takerNickname = userInfo.nickname;
          
          wx.setStorageSync('orders', orders);
          
          wx.showToast({
            title: '接单成功！',
            icon: 'success'
          });
          
          // 跳转到订单页面
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/orders/orders'
            });
          }, 1000);
        }
      }
    });
  },

  goToPlace: function() {
    wx.switchTab({
      url: '/pages/place/place'
    });
  }
});