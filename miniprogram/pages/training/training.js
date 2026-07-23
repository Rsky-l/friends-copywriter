const api = require('../../utils/api');

Page({
  data: {
    hotScenes: [],
    skills: [
      { key: 'logic', icon: '🧠', name: '逻辑力', desc: '结构化表达，清晰论证', progress: 30 },
      { key: 'empathy', icon: '💛', name: '共情力', desc: '情感连接，理解他人', progress: 20 },
      { key: 'rebuttal', icon: '⚔️', name: '反驳力', desc: '拆解逻辑，精准回击', progress: 15 },
      { key: 'humor', icon: '😄', name: '幽默力', desc: '化解僵局，轻松表达', progress: 10 }
    ]
  },

  async onLoad() {
    try {
      const res = await api.getScenes();
      this.setData({ hotScenes: res.scenes.slice(0, 6) });
    } catch (err) { /* 使用预设场景 */ }
  },

  onBattleScene(e) {
    const { id, name } = e.detail;
    wx.navigateTo({
      url: `/pages/battle/battle?sceneName=${encodeURIComponent(name)}&topic=`
    });
  },

  onSkillTap(e) {
    const skill = e.currentTarget.dataset.skill;
    wx.showToast({ title: `「${skill}」专项练习即将上线`, icon: 'none' });
  },

  onViewNotes() {
    wx.navigateTo({ url: '/pages/notes/notes' });
  }
});
