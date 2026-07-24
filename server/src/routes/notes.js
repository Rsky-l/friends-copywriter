const express = require('express');
const router = express.Router();
const { notes } = require('../store');

// GET /api/notes - 获取所有笔记
router.get('/', (req, res) => {
  const { scene, keyword, limit = 50, offset = 0 } = req.query;

  let userNotes = notes.filter(n => n.userId === req.userId);

  if (scene) {
    userNotes = userNotes.filter(n => n.scene === scene);
  }
  if (keyword) {
    const kw = keyword.toLowerCase();
    userNotes = userNotes.filter(n =>
      (n.opponentView && n.opponentView.includes(kw)) ||
      (n.expression && n.expression.includes(kw)) ||
      (n.scene && n.scene.includes(kw))
    );
  }

  userNotes.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

  const paged = userNotes.slice(Number(offset), Number(offset) + Number(limit));

  res.json({ notes: paged, total: userNotes.length });
});

// POST /api/notes - 保存笔记
router.post('/', (req, res) => {
  const { scene, opponentView, userThoughts, style, expression, technique, counterPredictions, generationId } = req.body;

  if (!expression) {
    return res.status(400).json({ error: '表达内容不能为空' });
  }

  const note = {
    id: Date.now().toString(),
    userId: req.userId,
    scene: scene || '未分类',
    opponentView: opponentView || '',
    userThoughts: userThoughts || '',
    style: style || 'logical',
    expression,
    technique: technique || null,
    counterPredictions: counterPredictions || [],
    generationId: generationId || null,
    tags: [],
    starred: false,
    savedAt: new Date().toISOString()
  };

  notes.push(note);
  res.json({ note });
});

// DELETE /api/notes/:id - 删除笔记
router.delete('/:id', (req, res) => {
  const index = notes.findIndex(n => n.id === req.params.id && n.userId === req.userId);
  if (index === -1) {
    return res.status(404).json({ error: '笔记不存在' });
  }
  notes.splice(index, 1);
  res.json({ success: true });
});

// PATCH /api/notes/:id/star - 切换标记
router.patch('/:id/star', (req, res) => {
  const note = notes.find(n => n.id === req.params.id && n.userId === req.userId);
  if (!note) {
    return res.status(404).json({ error: '笔记不存在' });
  }
  note.starred = !note.starred;
  res.json({ note });
});

module.exports = router;
