Page({
  data: {
    cacheSize: '计算中...',
    appVersion: '1.0.0'
  },

  onLoad() {
    this.calcCacheSize();
  },

  calcCacheSize() {
    try {
      const info = wx.getStorageInfoSync();
      const sizeKB = info.currentSize;
      if (sizeKB < 1024) {
        this.setData({ cacheSize: `${sizeKB} KB` });
      } else {
        this.setData({ cacheSize: `${(sizeKB / 1024).toFixed(1)} MB` });
      }
    } catch (e) {
      this.setData({ cacheSize: '未知' });
    }
  },

  onClearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '将清除所有本地缓存数据（包括性别设置等），确定继续？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          this.setData({ cacheSize: '0 KB' });
          wx.showToast({ title: '缓存已清除', icon: 'success' });

          // 重置 TabBar 图标为女性默认
          const pages = getCurrentPages();
          const page = pages[pages.length - 1];
          if (page && typeof page.getTabBar === 'function' && page.getTabBar()) {
            page.getTabBar().updateProfileIcon();
          }
        }
      }
    });
  },

  onAbout() {
    wx.showModal({
      title: '想好了说',
      content: '版本 1.0.0\n\n帮你把碎片想法变成有力表达。\n\n训练逻辑力、共情力、反驳力、幽默力，让每一次表达都更有分量。',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  onFeedback() {
    wx.showActionSheet({
      itemList: ['复制邮箱地址', '发送邮件'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.setClipboardData({
            data: '3035494048@qq.com',
            success: () => wx.showToast({ title: '邮箱已复制', icon: 'success' })
          });
        } else if (res.tapIndex === 1) {
          wx.showToast({ title: '请使用手机邮箱 App 发送', icon: 'none' });
        }
      }
    });
  }
});
