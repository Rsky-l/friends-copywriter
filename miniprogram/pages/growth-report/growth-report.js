const api = require('../../utils/api');

const STYLE_LABELS = {
  logical: '逻辑型',
  humorous: '幽默型',
  rhetorical: '反问型',
  empathic: '共情型'
};

const STYLE_ICONS = {
  logical: '🧠',
  humorous: '😄',
  rhetorical: '⚡',
  empathic: '💛'
};

const STYLE_COLORS = {
  logical: '#FF7A45',
  humorous: '#FAAD14',
  rhetorical: '#722ED1',
  empathic: '#EB2F96'
};

const SKILL_META = {
  logic: { name: '逻辑力', icon: '🧠', tip: '论点清晰，推理有力' },
  empathy: { name: '共情力', icon: '💛', tip: '先连接情感，再传递观点' },
  rebuttal: { name: '反驳力', icon: '⚔️', tip: '精准拆解，不伤和气' },
  humor: { name: '幽默力', icon: '😄', tip: '用轻松化解紧张' }
};

const ACTIVITY_LABELS = {
  generate: '生成表达',
  battle: '模拟对战',
  note: '保存笔记'
};

Page({
  data: {
    loading: true,
    overview: null,
    skillScores: {},
    skillEntries: [],
    styleDistribution: {},
    styleEntries: [],
    strengthAreas: [],
    improvementAreas: [],
    recentActivity: []
  },

  onLoad() {
    this.fetchOverview();
  },

  async fetchOverview() {
    this.setData({ loading: true });
    try {
      const data = await api.getGrowthOverview();

      // 技能维度（只保留有效的）
      const skillEntries = Object.entries(data.skillScores || {})
        .filter(([key]) => SKILL_META[key])
        .map(([key, score]) => ({
          key,
          ...SKILL_META[key],
          score: Math.min(score, 100)
        }))
        .sort((a, b) => b.score - a.score);

      // 风格分布
      const totalStyles = Object.values(data.styleDistribution || {}).reduce((s, v) => s + v, 0) || 1;
      const styleEntries = Object.entries(data.styleDistribution || {})
        .filter(([key]) => STYLE_LABELS[key])
        .map(([key, count]) => ({
          key,
          icon: STYLE_ICONS[key],
          label: STYLE_LABELS[key],
          color: STYLE_COLORS[key],
          count,
          percent: Math.round(count / totalStyles * 100)
        }))
        .sort((a, b) => b.count - a.count);

      // 近期活动格式化
      const recentActivity = (data.recentActivity || []).map(item => ({
        ...item,
        label: ACTIVITY_LABELS[item.type] || item.type,
        timeStr: this.formatTime(item.time)
      }));

      this.setData({
        loading: false,
        overview: {
          totalPractices: data.totalPractices || 0,
          totalBattles: data.totalBattles || 0,
          completedBattles: data.completedBattles || 0,
          totalRounds: data.totalRounds || 0,
          totalNotes: data.totalNotes || 0
        },
        skillScores: data.skillScores || {},
        skillEntries,
        styleDistribution: data.styleDistribution || {},
        styleEntries,
        strengthAreas: data.strengthAreas || [],
        improvementAreas: data.improvementAreas || [],
        recentActivity
      });
    } catch (err) {
      console.error('加载成长报告失败:', err);
      wx.showToast({ title: '加载失败，请稍后重试', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  onGoTraining() {
    wx.switchTab({ url: '/pages/training/training' });
  },

  formatTime(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${m}月${day}日`;
  }
});
