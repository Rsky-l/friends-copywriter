const express = require('express');
const router = express.Router();
const { battleTurn, debriefBattle } = require('../services/ai');

// 内存存储（MVP 阶段）
const battles = {};

// POST /api/battle/start - 开始新对战
router.post('/start', async (req, res) => {
  const { scene, topic } = req.body;

  if (!scene || !topic) {
    return res.status(400).json({ error: '请提供场景和话题' });
  }

  const battleId = Date.now().toString();
  const initialMessage = `我听说你对"${topic}"有自己的看法，说说看？`;

  battles[battleId] = {
    id: battleId,
    userId: req.userId,
    scene,
    topic,
    rounds: [
      { role: 'opponent', content: initialMessage, attackPoint: null, difficulty: 'easy' }
    ],
    createdAt: new Date().toISOString()
  };

  res.json({
    battleId,
    message: initialMessage,
    round: 1
  });
});

// POST /api/battle/turn - 用户回应 + AI 反击
router.post('/turn', async (req, res) => {
  const { battleId, userResponse } = req.body;

  if (!battleId || !userResponse) {
    return res.status(400).json({ error: '请提供对战ID和你的回应' });
  }

  const battle = battles[battleId];
  if (!battle) {
    return res.status(404).json({ error: '对战不存在或已结束' });
  }
  if (battle.ended) {
    return res.status(400).json({ error: '对战已结束，无法继续' });
  }

  // 构建对话历史文本（包含本轮用户回应，但不预先提交到 rounds）
  const historyText = [
    ...battle.rounds.map(r => `${r.role === 'opponent' ? '对手' : '你'}: ${r.content}`),
    `你: ${userResponse}`
  ].join('\n');

  try {
    const result = await battleTurn(battle.scene, historyText);

    // AI 调用成功后原子性提交本轮双方消息
    battle.rounds.push({ role: 'user', content: userResponse });
    battle.rounds.push({
      role: 'opponent',
      content: result.reply,
      attackPoint: result.attackPoint,
      difficulty: result.difficulty
    });

    res.json({
      round: Math.ceil(battle.rounds.length / 2),
      opponentReply: result.reply,
      attackPoint: result.attackPoint,
      difficulty: result.difficulty,
      history: battle.rounds
    });
  } catch (error) {
    console.error('对战回合失败:', error.message);
    res.status(500).json({ error: '生成失败，请稍后重试' });
  }
});

// POST /api/battle/end - 结束对战并获取复盘
router.post('/end', async (req, res) => {
  const { battleId } = req.body;
  const battle = battles[battleId];

  if (!battle) {
    return res.status(404).json({ error: '对战不存在' });
  }

  const historyText = battle.rounds
    .map(r => `${r.role === 'opponent' ? '对手' : '你'}: ${r.content}`)
    .join('\n');

  try {
    const debrief = await debriefBattle(historyText);
    battle.debrief = debrief;
    battle.ended = true;
    battle.endedAt = new Date().toISOString();

    res.json({
      totalRounds: Math.floor(battle.rounds.length / 2),
      debrief,
      history: battle.rounds
    });
  } catch (error) {
    console.error('复盘生成失败:', error.message);
    res.status(500).json({ error: '复盘生成失败' });
  }
});

// GET /api/battle/stats - 获取用户对战统计
router.get('/stats', (req, res) => {
  const userBattles = Object.values(battles).filter(b => b.userId === req.userId);
  res.json({
    totalBattles: userBattles.length,
    completedBattles: userBattles.filter(b => b.ended).length,
    totalRounds: userBattles.reduce((sum, b) => sum + Math.floor(b.rounds.length / 2), 0)
  });
});

module.exports = router;
