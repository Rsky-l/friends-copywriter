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
    // API 服务器地址
    // 电脑上开发工具测试用 localhost，手机真机预览用局域网 IP
    // 切换方法：注释掉一行，取消注释另一行
    // apiBase: 'http://localhost:3000',       // 开发者工具
    apiBase: 'http://192.168.110.36:3000',     // 手机真机预览
    // 当前选中的场景
    currentScene: null
  }
});
