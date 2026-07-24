const api = require('../../utils/api');

Page({
  data: {
    keyword: '',
    scenes: [],
    loading: true
  },

  onLoad() {
    this.loadScenes();
  },

  onShow() {
    const app = getApp();
    app.globalData.currentScene = null;
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  async loadScenes() {
    this.setData({ loading: true });
    try {
      const res = await api.getScenes(this.data.keyword || undefined);
      this.setData({ scenes: res.scenes, loading: false });
    } catch (err) {
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onSearch() {
    this.loadScenes();
  },

  onClearSearch() {
    this.setData({ keyword: '' });
    this.loadScenes();
  },

  onSceneSelect(e) {
    const { id, name, icon } = e.detail;
    const app = getApp();
    app.globalData.currentScene = { id, name, icon };
    wx.navigateTo({
      url: `/pages/generate/generate?sceneId=${id}&sceneName=${name}&sceneIcon=${icon}`
    });
  }
});
