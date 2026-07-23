const express = require('express');
const router = express.Router();
const { generateExpression } = require('../services/ai');

// 内存存储（MVP 阶段，后续迁移至数据库）
const generationHistory = [];

// POST /api/generate - 生成表达
router.post('/', async (req, res) => {
  const { scene, opponentView, userThoughts, style = 'logical' } = req.body;

  if (!opponentView || !userThoughts) {
    return res.status(400).json({
      error: '请填写对方观点和你的想法'
    });
  }

  const validStyles = ['logical', 'humorous', 'rhetorical', 'empathic'];
  if (!validStyles.includes(style)) {
    return res.status(400).json({
      error: `无效的风格，可选: ${validStyles.join(', ')}`
    });
  }

  try {
    const result = await generateExpression(scene || '日常对话', opponentView, userThoughts, style);

    // 异步保存历史
    generationHistory.push({
      id: Date.now().toString(),
      userId: req.userId,
      scene,
      opponentView,
      userThoughts,
      style,
      result,
      createdAt: new Date().toISOString()
    });

    res.json({
      id: generationHistory[generationHistory.length - 1].id,
      ...result
    });
  } catch (error) {
    console.error('生成表达失败:', error.message);
    res.status(500).json({
      error: '生成失败，请稍后重试',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/generate/history - 获取用户的历史生成记录
router.get('/history', (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  const matchingRecords = generationHistory
    .filter(r => r.userId === req.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = matchingRecords.length;
  const userRecords = matchingRecords.slice(Number(offset), Number(offset) + Number(limit));

  res.json({ records: userRecords, total });
});

module.exports = router;
