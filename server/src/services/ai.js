const axios = require('axios');
const { buildGeneratePrompt, buildBattlePrompt, buildDebriefPrompt, buildSkillPracticePrompt } = require('./prompts');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'sk-your-key-here') {
  console.warn('⚠ DEEPSEEK_API_KEY is not configured. AI calls will fail.');
}

/**
 * 从 AI 返回的原始文本中安全提取 JSON。
 * 处理 markdown 代码块包裹、前后多余文本等常见 LLM 输出问题。
 */
function safeJsonParse(raw) {
  let text = raw.trim();

  // 去除 markdown 代码块包裹 ```json ... ```
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  // 如果仍不是以 { 开头，尝试提取第一个 JSON 对象
  if (!text.startsWith('{')) {
    const objMatch = text.match(/\{[\s\S]*\}/);
    if (objMatch) {
      text = objMatch[0];
    }
  }

  // 如果仍不是以 { 开头，尝试提取第一个 JSON 数组
  if (!text.startsWith('{') && !text.startsWith('[')) {
    const arrMatch = text.match(/\[[\s\S]*\]/);
    if (arrMatch) {
      text = arrMatch[0];
    }
  }

  try {
    return JSON.parse(text);
  } catch (firstError) {
    // 尝试修复常见 JSON 问题：尾部多余逗号
    try {
      const fixed = text.replace(/,(?=\s*[}\]])/g, '');
      return JSON.parse(fixed);
    } catch (secondError) {
      throw new Error(`JSON 解析失败: ${firstError.message}. 原始内容前200字符: ${raw.substring(0, 200)}`);
    }
  }
}

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
  const systemPrompt = buildGeneratePrompt(scene, opponentView, userThoughts, style);
  const userMessage = `请为以下情况生成表达：\n场景：${scene}\n风格：${style}`;

  const result = await chatCompletion(systemPrompt, userMessage, {
    temperature: 0.8,
    maxTokens: 2000
  });

  return safeJsonParse(result);
}

async function battleTurn(scene, history) {
  const systemPrompt = buildBattlePrompt(scene, history);
  const userMessage = '请给出你的下一轮反驳';

  const result = await chatCompletion(systemPrompt, userMessage, {
    temperature: 0.9,
    maxTokens: 1000
  });

  return safeJsonParse(result);
}

async function debriefBattle(history) {
  const systemPrompt = buildDebriefPrompt(history);
  const userMessage = '请复盘以上对话';

  const result = await chatCompletion(systemPrompt, userMessage, {
    temperature: 0.5,
    maxTokens: 1500
  });

  return safeJsonParse(result);
}

async function evaluateSkillPractice(skillKey, skillName, scenario, userAnswer) {
  const systemPrompt = buildSkillPracticePrompt(skillKey, skillName, scenario, userAnswer);
  const userMessage = `请评估我在"${skillName}"方面的练习表现`;

  const result = await chatCompletion(systemPrompt, userMessage, {
    temperature: 0.5,
    maxTokens: 1500
  });

  return safeJsonParse(result);
}

module.exports = { chatCompletion, generateExpression, battleTurn, debriefBattle, evaluateSkillPractice };
