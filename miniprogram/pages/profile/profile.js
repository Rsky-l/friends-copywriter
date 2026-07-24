const api = require('../../utils/api');

Page({
  data: {
    stats: { totalGenerations: 0, totalBattles: 0, totalNotes: 0 },
    profileGender: 'female'
  },

  onLoad() {
    const gender = wx.getStorageSync('profileGender') || 'female';
    this.setData({ profileGender: gender });
  },

  async onShow() {
    // 通知自定义 TabBar 当前选中
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
    try {
      const [notesRes, historyRes, battleStatsRes] = await Promise.all([
        api.getNotes({ limit: 1000 }),
        api.getHistory({ limit: 1000 }),
        api.getBattleStats()
      ]);
      this.setData({
        stats: {
          totalGenerations: historyRes.records ? historyRes.records.length : 0,
          totalBattles: battleStatsRes.totalBattles || 0,
          totalNotes: notesRes.total || 0
        }
      });
    } catch (err) {
      console.error('加载统计数据失败:', err);
      // 保持默认 0，页面仍可正常展示
    }
  },

  onViewNotes() {
    wx.navigateTo({ url: '/pages/notes/notes' });
  },

  onViewGrowthReport() {
    wx.navigateTo({ url: '/pages/growth-report/growth-report' });
  },

  onSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  onToggleGender() {
    const newGender = this.data.profileGender === 'female' ? 'male' : 'female';
    wx.setStorageSync('profileGender', newGender);
    this.setData({ profileGender: newGender });

    // 刷新自定义 TabBar 图标
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().updateProfileIcon();
    }
  }
});
