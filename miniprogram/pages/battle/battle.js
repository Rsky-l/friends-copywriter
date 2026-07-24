const api = require('../../utils/api');

Page({
  data: {
    sceneName: '',
    topic: '',
    battleId: null,
    messages: [],
    currentRound: 1,
    waiting: false,
    battleEnded: false,
    showThoughtInput: false,
    quickThought: '',
    manualMode: false,
    manualText: '',
    showDebrief: false,
    debrief: {},
    scoreList: []
  },

  onLoad(options) {
    const sceneName = decodeURIComponent(options.sceneName || '日常对话');
    const topic = decodeURIComponent(options.topic || '');
    this.setData({ sceneName, topic });
    this.startBattle();
  },

  async startBattle() {
    this.setData({ waiting: true });
    try {
      const res = await api.startBattle({
        scene: this.data.sceneName,
        topic: this.data.topic || '一个你关心的话题'
      });
      this.setData({
        battleId: res.battleId,
        messages: [{ role: 'opponent', content: res.message }],
        currentRound: 1,
        waiting: false
      });
    } catch (err) {
      wx.showToast({ title: '开始对战失败', icon: 'none' });
      this.setData({ waiting: false });
    }
  },

  onToggleThought() {
    this.setData({ showThoughtInput: !this.data.showThoughtInput });
  },

  onQuickThought(e) {
    this.setData({ quickThought: e.detail.value });
  },

  async onGenerateResponse() {
    if (this.data.waiting) return;
    const quickThought = this.data.quickThought.trim();
    if (!quickThought) {
      wx.showToast({ title: '请先输入你的碎片想法', icon: 'none' });
      return;
    }
    await this.sendTurn(quickThought);
  },

  async sendTurn(userResponse) {
    this.setData({ waiting: true, showThoughtInput: false, quickThought: '' });

    const messages = [...this.data.messages, { role: 'user', content: userResponse }];
    this.setData({ messages });

    try {
      const res = await api.battleTurn({
        battleId: this.data.battleId,
        userResponse
      });

      this.setData({
        messages: res.history.map(r => ({
          role: r.role,
          content: r.content,
          attackPoint: r.role === 'opponent' ? r.attackPoint : ''
        })),
        currentRound: res.round,
        waiting: false
      });
    } catch (err) {
      wx.showToast({ title: '回合失败', icon: 'none' });
      this.setData({ waiting: false });
    }
  },

  onManualInput() {
    this.setData({ manualMode: true, manualText: '' });
  },

  onManualText(e) {
    this.setData({ manualText: e.detail.value });
  },

  onCancelManual() {
    this.setData({ manualMode: false });
  },

  async onSendManual() {
    const text = this.data.manualText.trim();
    if (!text) return;
    this.setData({ manualMode: false });
    await this.sendTurn(text);
  },

  async onEndBattle() {
    if (this.data.battleEnded) return;
    this.setData({ waiting: true });

    try {
      const res = await api.endBattle({ battleId: this.data.battleId });
      const scoreList = res.debrief.score ? [
        { key: 'logic', label: '逻辑力', value: res.debrief.score.logic },
        { key: 'empathy', label: '共情力', value: res.debrief.score.empathy },
        { key: 'clarity', label: '清晰度', value: res.debrief.score.clarity },
        { key: 'creativity', label: '创造力', value: res.debrief.score.creativity }
      ] : [];

      this.setData({
        battleEnded: true,
        waiting: false,
        showDebrief: true,
        debrief: res.debrief,
        scoreList
      });
    } catch (err) {
      wx.showToast({ title: '复盘生成失败', icon: 'none' });
      this.setData({ waiting: false });
    }
  },

  onCloseDebrief() {
    this.setData({ showDebrief: false });
    wx.navigateBack();
  }
});
