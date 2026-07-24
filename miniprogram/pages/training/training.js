const api = require('../../utils/api');

const DEFAULT_SKILLS = [
  { key: 'logic', icon: '🧠', name: '逻辑力', desc: '结构化表达，清晰论证', progress: 0 },
  { key: 'empathy', icon: '💛', name: '共情力', desc: '情感连接，理解他人', progress: 0 },
  { key: 'rebuttal', icon: '⚔️', name: '反驳力', desc: '拆解逻辑，精准回击', progress: 0 },
  { key: 'humor', icon: '😄', name: '幽默力', desc: '化解僵局，轻松表达', progress: 0 }
];

Page({
  data: {
    keyword: '',
    hotScenes: [],
    skills: DEFAULT_SKILLS
  },

  async onLoad() {
    this.loadScenes();
    this.loadSkillProgress();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
    // 每次回到训练场刷新技能进度
    this.loadSkillProgress();
  },

  async loadScenes() {
    try {
      const res = await api.getScenes(this.data.keyword || undefined);
      const scenes = this.data.keyword ? res.scenes : res.scenes.slice(0, 6);
      this.setData({ hotScenes: scenes });
    } catch (err) {
      console.error('加载场景失败:', err);
    }
  },

  async loadSkillProgress() {
    try {
      const data = await api.getGrowthOverview();
      const scores = data.skillScores || {};
      const skills = DEFAULT_SKILLS.map(s => ({
        ...s,
        progress: scores[s.key] || 0
      }));
      this.setData({ skills });
    } catch (err) {
      console.error('加载技能进度失败:', err);
      // 保持默认 0，不影响页面展示
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

  onBattleScene(e) {
    const { id, name } = e.detail;
    wx.navigateTo({
      url: `/pages/battle/battle?sceneName=${encodeURIComponent(name)}&topic=`
    });
  },

  onSkillTap(e) {
    const skillKey = e.currentTarget.dataset.skill;
    const skill = this.data.skills.find(s => s.key === skillKey);
    wx.navigateTo({
      url: `/pages/skill-practice/skill-practice?key=${skillKey}&name=${encodeURIComponent(skill.name)}&icon=${encodeURIComponent(skill.icon)}`
    });
  },

  onViewNotes() {
    wx.navigateTo({ url: '/pages/notes/notes' });
  }
});
