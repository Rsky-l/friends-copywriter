App({
  onLaunch() {
    // 获取设备标识作为临时用户 ID
    const deviceId = wx.getStorageSync('deviceId');
    if (!deviceId) {
      const newId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      wx.setStorageSync('deviceId', newId);
      this.globalData.deviceId = newId;
    } else {
      this.globalData.deviceId = deviceId;
    }
  },

  globalData: {
    deviceId: null,
    // API 服务器地址 - 开发环境
    apiBase: 'http://localhost:3000',
    // 当前选中的场景
    currentScene: null
  }
});
