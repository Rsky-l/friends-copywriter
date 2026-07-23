const api = require('../../utils/api');

Page({
  data: {
    stats: { totalGenerations: 0, totalBattles: 0, totalNotes: 0 }
  },

  async onShow() {
    try {
      const [notesRes, historyRes] = await Promise.all([
        api.getNotes({ limit: 1000 }),
        api.getHistory({ limit: 1000 })
      ]);
      this.setData({
        stats: {
          totalGenerations: historyRes.records ? historyRes.records.length : 0,
          totalBattles: 0,
          totalNotes: notesRes.total || 0
        }
      });
    } catch (err) { /* 保持默认 0 */ }
  },

  onViewNotes() {
    wx.navigateTo({ url: '/pages/notes/notes' });
  }
});
