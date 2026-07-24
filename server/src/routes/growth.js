const express = require('express');
const router = express.Router();
const { notes, battles, generationHistory } = require('../store');

// GET /api/growth/overview - 用户成长数据总览
router.get('/overview', (req, res) => {
  const userId = req.userId;

  // 生成记录
  const userHistory = generationHistory.filter(r => r.userId === userId);
  const totalGenerations = userHistory.length;

  // 风格分布
  const styleDistribution = { logical: 0, humorous: 0, rhetorical: 0, empathic: 0 };
  userHistory.forEach(r => {
    if (styleDistribution[r.style] !== undefined) {
      styleDistribution[r.style]++;
    }
  });

  // 对战数据
  const userBattles = Object.values(battles).filter(b => b.userId === userId);
  const totalBattles = userBattles.length;
  const completedBattles = userBattles.filter(b => b.ended).length;
  const totalRounds = userBattles.reduce((sum, b) => sum + Math.floor(b.rounds.length / 2), 0);

  // 技能评分（从对战复盘数据中提取）
  const skillScores = { logic: 0, empathy: 0, rebuttal: 0, humor: 0 };
  let scoreCount = 0;

  userBattles.filter(b => b.ended && b.debrief && b.debrief.score).forEach(battle => {
    const s = battle.debrief.score;
    if (s.logic) { skillScores.logic += s.logic; scoreCount++; }
    if (s.empathy) { skillScores.empathy += s.empathy; }
    if (s.clarity) { skillScores.rebuttal += s.clarity; } // clarity → 反驳力
    if (s.creativity) { skillScores.humor += s.creativity; } // creativity → 幽默力
  });

  // 计算平均分（如果有数据）
  const hasScores = scoreCount > 0;
  if (hasScores) {
    skillScores.logic = Math.round(skillScores.logic / scoreCount);
    // empathy/clarity/creativity 每场都有，用 completedBattles
    const battleCount = completedBattles || 1;
    skillScores.empathy = Math.round(skillScores.empathy / battleCount);
    skillScores.rebuttal = Math.round(skillScores.rebuttal / battleCount);
    skillScores.humor = Math.round(skillScores.humor / battleCount);
  }

  // 笔记数据
  const userNotes = notes.filter(n => n.userId === userId);
  const totalNotes = userNotes.length;

  // 近期活动（最近 10 条，按时间排序）
  const activities = [];

  userHistory.forEach(r => {
    activities.push({
      type: 'generate',
      scene: r.scene || '日常对话',
      style: r.style,
      time: r.createdAt
    });
  });

  userBattles.filter(b => b.ended).forEach(b => {
    activities.push({
      type: 'battle',
      scene: b.scene,
      rounds: Math.floor(b.rounds.length / 2),
      time: b.endedAt || b.createdAt
    });
  });

  userNotes.forEach(n => {
    activities.push({
      type: 'note',
      scene: n.scene,
      style: n.style,
      time: n.savedAt
    });
  });

  activities.sort((a, b) => new Date(b.time) - new Date(a.time));
  const recentActivity = activities.slice(0, 10);

  // 强项和待提升项
  const skillEntries = Object.entries(skillScores);
  skillEntries.sort((a, b) => b[1] - a[1]);
  const strengthAreas = hasScores ? [skillEntries[0][0]] : [];
  const improvementAreas = hasScores ? [skillEntries[skillEntries.length - 1][0]] : [];

  // 技能名称映射
  const skillNameMap = { logic: '逻辑力', empathy: '共情力', rebuttal: '反驳力', humor: '幽默力' };

  res.json({
    totalGenerations,
    totalBattles,
    completedBattles,
    totalRounds,
    totalNotes,
    totalPractices: totalGenerations + completedBattles,
    styleDistribution,
    skillScores,
    strengthAreas: strengthAreas.map(s => ({ key: s, name: skillNameMap[s] || s })),
    improvementAreas: improvementAreas.map(s => ({ key: s, name: skillNameMap[s] || s })),
    recentActivity
  });
});

module.exports = router;
