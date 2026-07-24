const api = require('../../utils/api');

Page({
  data: {
    stats: { totalGenerations: 0, totalBattles: 0, totalNotes: 0 }
  },

  async onShow() {
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
  }
});
