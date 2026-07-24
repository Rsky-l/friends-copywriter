const express = require('express');
const router = express.Router();
const { evaluateSkillPractice } = require('../services/ai');

// POST /api/skill/practice - 技能练习评估
router.post('/practice', async (req, res) => {
  const { skill, skillName, scenario, userAnswer } = req.body;

  if (!skill || !scenario || !userAnswer) {
    return res.status(400).json({ error: '请提供技能类型、场景和你的练习回答' });
  }

  const validSkills = ['logic', 'empathy', 'rebuttal', 'humor'];
  if (!validSkills.includes(skill)) {
    return res.status(400).json({ error: `无效的技能类型，可选: ${validSkills.join(', ')}` });
  }

  try {
    const result = await evaluateSkillPractice(skill, skillName || skill, scenario, userAnswer);
    res.json(result);
  } catch (error) {
    console.error('技能练习评估失败:', error.message);
    res.status(500).json({ error: '评估失败，请稍后重试' });
  }
});

module.exports = router;
