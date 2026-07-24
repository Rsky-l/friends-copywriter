const api = require('../../utils/api');

Page({
  data: { keyword: '', notes: [], loading: true },

  onLoad(options) {
    if (options.scene) {
      this.setData({ keyword: decodeURIComponent(options.scene) });
    }
    this.loadNotes();
  },

  async loadNotes() {
    this.setData({ loading: true });
    try {
      const params = {};
      if (this.data.keyword) params.keyword = this.data.keyword;
      const res = await api.getNotes(params);
      this.setData({
        notes: res.notes.map(n => ({
          ...n,
          savedAt: n.savedAt ? n.savedAt.slice(0, 10) : ''
        })),
        loading: false
      });
    } catch (err) {
      console.error('加载笔记失败:', err);
      wx.showToast({ title: '加载笔记失败', icon: 'none' });
      this.setData({ loading: false, notes: [] });
    }
  },

  onSearchInput(e) { this.setData({ keyword: e.detail.value }); },
  onSearch() { this.loadNotes(); },

  async onToggleStar(e) {
    const id = e.currentTarget.dataset.id;
    try {
      await api.toggleStar(id);
      const notes = this.data.notes.map(n =>
        n.id === id ? { ...n, starred: !n.starred } : n
      );
      this.setData({ notes });
    } catch (err) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  async onDeleteNote(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.deleteNote(id);
            this.setData({
              notes: this.data.notes.filter(n => n.id !== id)
            });
          } catch (err) {
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  }
});
