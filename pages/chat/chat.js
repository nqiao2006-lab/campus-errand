// pages/chat/chat.js
Page({
  data: {
    conversationId: '',
    otherNickname: '',
    messages: [],
    inputText: '',
    scrollTop: 999999
  },

  onLoad(options) {
    this.setData({
      conversationId: options.conversationId,
      otherNickname: options.otherNickname
    });
    wx.setNavigationBarTitle({ title: options.otherNickname });
    this.loadMessages();
    this.markAsRead();
  },

  loadMessages() {
    const messages = wx.getStorageSync('messages') || [];
    const convMessages = messages.filter(m => m.conversationId === this.data.conversationId);
    convMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    this.setData({ messages: convMessages }, () => {
      this.scrollToBottom();
    });
  },

  markAsRead() {
    const conversations = wx.getStorageSync('conversations') || [];
    const conv = conversations.find(c => c.conversationId === this.data.conversationId);
    if (conv) {
      conv.unreadCount = 0;
      wx.setStorageSync('conversations', conversations);
    }
  },

  onInput(e) {
    this.setData({ inputText: e.detail.value });
  },

  sendMessage() {
    const content = this.data.inputText.trim();
    if (!content) return;

    const userInfo = wx.getStorageSync('userInfo');
    const newMsg = {
      id: 'msg_' + Date.now() + '_' + Math.random(),
      conversationId: this.data.conversationId,
      senderId: userInfo.id,
      content: content,
      timestamp: new Date().toISOString()
    };

    const messages = wx.getStorageSync('messages') || [];
    messages.push(newMsg);
    wx.setStorageSync('messages', messages);

    // 更新会话最后消息
    const conversations = wx.getStorageSync('conversations') || [];
    const conv = conversations.find(c => c.conversationId === this.data.conversationId);
    if (conv) {
      conv.lastMsg = content;
      conv.lastTime = newMsg.timestamp;
      wx.setStorageSync('conversations', conversations);
    }

    this.setData({ inputText: '' });
    this.loadMessages();
  },

  scrollToBottom() {
    this.setData({ scrollTop: 999999 });
  }
});