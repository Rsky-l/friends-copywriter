const api = require('../../utils/api');

Page({
  data: {
    sceneName: '',
    sceneIcon: '',
    opponentView: '',
    userThoughts: '',
    currentStyle: 'logical',
    switchingStyle: false,
    styleResults: {},
    currentData: { expression: '', userSource: [], aiSupplement: [], technique: null, counterPredictions: [] }
  },

  onLoad() {
    const app = getApp();
    const data = app.globalData.lastResult;

    if (!data) {
      wx.showToast({ title: '数据丢失，请重新生成', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    this.setData({
      sceneName: data.sceneName || '',
      sceneIcon: data.sceneIcon || '',
      opponentView: data.opponentView || '',
      userThoughts: data.userThoughts || '',
      styleResults: {
        logical: data.result
      },
      currentData: data.result
    });
  },

  async onStyleChange(e) {
    const newStyle = e.detail.style;
    if (newStyle === this.data.currentStyle) return;

    if (this.data.styleResults[newStyle]) {
      this.setData({
        currentStyle: newStyle,
        currentData: this.data.styleResults[newStyle]
      });
      return;
    }

    this.setData({ switchingStyle: true });
    try {
      const result = await api.generate({
        scene: this.data.sceneName,
        opponentView: this.data.opponentView,
        userThoughts: this.data.userThoughts,
        style: newStyle
      });

      const styleResults = { ...this.data.styleResults, [newStyle]: result };
      this.setData({
        currentStyle: newStyle,
        styleResults,
        currentData: result,
        switchingStyle: false
      });
    } catch (err) {
      wx.showToast({ title: '切换失败', icon: 'none' });
      this.setData({ switchingStyle: false });
    }
  },

  onCopyAll() {
    const text = this.data.currentData.expression;
    wx.setClipboardData({
      data: text,
      success() {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  },

  async onSaveNote() {
    try {
      await api.saveNote({
        scene: this.data.sceneName,
        opponentView: this.data.opponentView,
        userThoughts: this.data.userThoughts,
        style: this.data.currentStyle,
        expression: this.data.currentData.expression,
        technique: this.data.currentData.technique,
        counterPredictions: this.data.currentData.counterPredictions
      });
      wx.showToast({ title: '已保存到笔记', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  onEnterBattle() {
    const topic = this.data.opponentView;
    wx.navigateTo({
      url: `/pages/battle/battle?sceneName=${encodeURIComponent(this.data.sceneName)}&topic=${encodeURIComponent(topic)}`
    });
  }
});
