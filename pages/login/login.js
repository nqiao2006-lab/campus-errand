// pages/login/login.js
Page({
  data: {
    nickname: '',
    phone: '',
    studentId: '',
    studentImgPath: '',
    faceImgPath: '',
    studentImgBase64: '',
    faceImgBase64: '',
    agree: false,
    submitting: false
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.verified) {
      wx.switchTab({ url: '/pages/home/home' });
    }
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onStudentIdInput(e) {
    this.setData({ studentId: e.detail.value });
  },

  getWxNickname() {
    wx.getUserProfile({
      desc: '用于完善个人资料',
      success: (res) => {
        this.setData({ nickname: res.userInfo.nickName });
      },
      fail: () => {
        wx.showToast({ title: '获取失败，请手动输入', icon: 'none' });
      }
    });
  },

  // 上传学生证 - 使用 chooseMedia
  uploadStudentImg() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({ studentImgPath: tempFilePath });
        // 转换为base64
        const fs = wx.getFileSystemManager();
        fs.readFile({
          filePath: tempFilePath,
          encoding: 'base64',
          success: (data) => {
            this.setData({ studentImgBase64: data.data });
          }
        });
      }
    });
  },

  // 人脸识别上传
  uploadFaceImg() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({ faceImgPath: tempFilePath });
        const fs = wx.getFileSystemManager();
        fs.readFile({
          filePath: tempFilePath,
          encoding: 'base64',
          success: (data) => {
            this.setData({ faceImgBase64: data.data });
          }
        });
      }
    });
  },

  onAgreeChange(e) {
    this.setData({ agree: e.detail.value.length > 0 });
  },

  submitVerify() {
    const { nickname, phone, studentId, studentImgBase64, faceImgBase64, agree, submitting } = this.data;
    if (!nickname.trim()) return wx.showToast({ title: '请填写昵称', icon: 'none' });
    if (!phone.trim()) return wx.showToast({ title: '请填写手机号', icon: 'none' });
    if (!studentId.trim()) return wx.showToast({ title: '请填写学号', icon: 'none' });
    if (!studentImgBase64) return wx.showToast({ title: '请上传学生证照片', icon: 'none' });
    if (!faceImgBase64) return wx.showToast({ title: '请进行人脸识别拍照', icon: 'none' });
    if (!agree) return wx.showToast({ title: '请同意隐私协议', icon: 'none' });
    if (submitting) return;

    this.setData({ submitting: true });
    wx.showLoading({ title: '审核中...' });

    // 模拟后台审核
    setTimeout(() => {
      wx.hideLoading();
      const userInfo = {
        id: 'u_' + Date.now(),
        nickname: nickname.trim(),
        phone: phone.trim(),
        studentId: studentId.trim(),
        verified: true,
        avatar: nickname.charAt(0).toUpperCase(),
        joinDate: new Date().toISOString(),
        credit: 100,
        completedOrders: 0,
        publishedOrders: 0
      };
      wx.setStorageSync('userInfo', userInfo);
      
      // 初始化存储
      if (!wx.getStorageSync('orders')) wx.setStorageSync('orders', []);
      if (!wx.getStorageSync('conversations')) wx.setStorageSync('conversations', []);
      if (!wx.getStorageSync('messages')) wx.setStorageSync('messages', []);
      
      wx.showToast({ title: '认证通过！', icon: 'success' });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/home/home' });
      }, 1500);
    }, 1500);
  },

  previewStudentImg() {
    if (this.data.studentImgPath) {
      wx.previewImage({ urls: [this.data.studentImgPath] });
    }
  },
  previewFaceImg() {
    if (this.data.faceImgPath) {
      wx.previewImage({ urls: [this.data.faceImgPath] });
    }
  }
});