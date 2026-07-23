const express = require('express');
const router = express.Router();

// 预设场景库
const PRESET_SCENES = [
  { id: 'work-meeting', name: '工作会议', icon: '💼', tags: ['职场', '沟通'] },
  { id: 'friend-argument', name: '朋友争论', icon: '💬', tags: ['社交', '观点'] },
  { id: 'family-talk', name: '家庭沟通', icon: '🏠', tags: ['家庭', '亲密'] },
  { id: 'interview', name: '面试准备', icon: '🎯', tags: ['职场', '自我展示'] },
  { id: 'dinner-social', name: '饭局社交', icon: '🍽️', tags: ['社交', '应酬'] },
  { id: 'upward-comm', name: '向上沟通', icon: '📈', tags: ['职场', '汇报'] },
  { id: 'relationship', name: '亲密关系', icon: '💕', tags: ['情感', '沟通'] },
  { id: 'public-speech', name: '公开演讲', icon: '🎤', tags: ['表达', '演讲'] },
  { id: 'negotiation', name: '谈判协商', icon: '🤝', tags: ['商务', '谈判'] },
  { id: 'customer-service', name: '客服维权', icon: '📞', tags: ['消费', '维权'] },
];

// GET /api/scenes - 获取场景列表，支持搜索
router.get('/', (req, res) => {
  const { keyword } = req.query;

  let scenes = PRESET_SCENES;
  if (keyword) {
    const kw = keyword.toLowerCase();
    scenes = scenes.filter(s =>
      s.name.includes(kw) ||
      s.tags.some(t => t.includes(kw)) ||
      s.id.includes(kw)
    );
  }

  res.json({ scenes });
});

// GET /api/scenes/:id - 获取单个场景
router.get('/:id', (req, res) => {
  const scene = PRESET_SCENES.find(s => s.id === req.params.id);
  if (!scene) {
    return res.status(404).json({ error: '场景不存在' });
  }
  res.json({ scene });
});

module.exports = router;
