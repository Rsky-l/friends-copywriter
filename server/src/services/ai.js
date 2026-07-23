const axios = require('axios');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

async function chatCompletion(systemPrompt, userMessage, options = {}) {
  const { temperature = 0.7, maxTokens = 2000, responseFormat } = options;

  const response = await axios.post(
    `${DEEPSEEK_BASE_URL}/v1/chat/completions`,
    {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature,
      max_tokens: maxTokens,
      ...(responseFormat ? { response_format: responseFormat } : {})
    },
    {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  );

  return response.data.choices[0].message.content;
}

async function generateExpression(scene, opponentView, userThoughts, style) {
  const { buildGeneratePrompt } = require('./prompts');
  const systemPrompt = buildGeneratePrompt(scene, opponentView, userThoughts, style);
  const userMessage = `请为以下情况生成表达：\n场景：${scene}\n风格：${style}`;

  const result = await chatCompletion(systemPrompt, userMessage, {
    temperature: 0.8,
    maxTokens: 2000
  });

  return JSON.parse(result);
}

async function battleTurn(scene, history) {
  const { buildBattlePrompt } = require('./prompts');
  const systemPrompt = buildBattlePrompt(scene, history);
  const userMessage = '请给出你的下一轮反驳';

  const result = await chatCompletion(systemPrompt, userMessage, {
    temperature: 0.9,
    maxTokens: 1000
  });

  return JSON.parse(result);
}

async function debriefBattle(history) {
  const { buildDebriefPrompt } = require('./prompts');
  const systemPrompt = buildDebriefPrompt(history);
  const userMessage = '请复盘以上对话';

  const result = await chatCompletion(systemPrompt, userMessage, {
    temperature: 0.5,
    maxTokens: 1500
  });

  return JSON.parse(result);
}

module.exports = { chatCompletion, generateExpression, battleTurn, debriefBattle };
