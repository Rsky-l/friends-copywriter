const api = require('../../utils/api');
const storage = require('../../utils/storage');

Page({
  data: {
    sceneId: '',
    sceneName: '',
    sceneIcon: '',
    opponentView: '',
    userThoughts: '',
    generating: false
  },

  onLoad(options) {
    const { sceneId, sceneName, sceneIcon } = options;
    this.setData({
      sceneId: sceneId || '',
      sceneName: decodeURIComponent(sceneName || ''),
      sceneIcon: decodeURIComponent(sceneIcon || '')
    });

    wx.setNavigationBarTitle({
      title: sceneName ? decodeURIComponent(sceneName) : '生成表达'
    });

    const draft = storage.getDraft(sceneId);
    if (draft) {
      this.setData({
        opponentView: draft.opponentView || '',
        userThoughts: draft.userThoughts || ''
      });
    }
  },

  onUnload() {
    if (this.data.opponentView || this.data.userThoughts) {
      storage.saveDraft(this.data.sceneId, {
        opponentView: this.data.opponentView,
        userThoughts: this.data.userThoughts
      });
    }
  },

  onOpponentInput(e) {
    this.setData({ opponentView: e.detail.value });
  },

  onThoughtsInput(e) {
    this.setData({ userThoughts: e.detail.value });
  },

  onVoiceInput() {
    wx.showToast({ title: '请使用键盘语音输入', icon: 'none' });
  },

  async onGenerate() {
    const { opponentView, userThoughts } = this.data;

    if (!opponentView.trim()) {
      wx.showToast({ title: '请填写对方的观点', icon: 'none' });
      return;
    }
    if (!userThoughts.trim()) {
      wx.showToast({ title: '请填写你的想法', icon: 'none' });
      return;
    }

    this.setData({ generating: true });

    try {
      const result = await api.generate({
        scene: this.data.sceneName,
        opponentView,
        userThoughts,
        style: 'logical'
      });

      storage.clearDraft(this.data.sceneId);

      // 通过 globalData 传递结果数据，避免 URL 参数溢出
      const app = getApp();
      app.globalData.lastResult = {
        sceneName: this.data.sceneName,
        sceneIcon: this.data.sceneIcon,
        opponentView,
        userThoughts,
        result
      };

      wx.navigateTo({
        url: '/pages/result/result'
      });
    } catch (err) {
      wx.showToast({ title: err.error || '生成失败，请重试', icon: 'none' });
    } finally {
      this.setData({ generating: false });
    }
  },

  onEnterBattle() {
    wx.navigateTo({
      url: `/pages/battle/battle?sceneId=${this.data.sceneId}&sceneName=${encodeURIComponent(this.data.sceneName)}`
    });
  },

  onViewNotes() {
    wx.navigateTo({
      url: `/pages/notes/notes?scene=${encodeURIComponent(this.data.sceneName)}`
    });
  }
});
