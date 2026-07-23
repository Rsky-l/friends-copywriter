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

  onLoad(options) {
    const rawData = decodeURIComponent(options.data || '{}');
    const parsed = JSON.parse(rawData);

    this.setData({
      sceneName: parsed.sceneName || '',
      sceneIcon: parsed.sceneIcon || '',
      opponentView: parsed.opponentView || '',
      userThoughts: parsed.userThoughts || '',
      styleResults: {
        logical: parsed.result
      },
      currentData: parsed.result
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
