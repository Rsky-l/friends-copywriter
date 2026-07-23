# 表达助手 - 微信小程序实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个以长期表达能力成长为核心的微信小程序，帮助用户将模糊想法组织成有力表达。

**Architecture:** 微信小程序原生前端 + Node.js/Express 后端 + DeepSeek API。前端通过 wx.request 调用后端 API，后端负责 AI Prompt 工程、用户数据管理。

**Tech Stack:** 微信小程序原生框架、Node.js、Express、DeepSeek API、微信登录

---

## 文件结构

```
miniprogram/                     # 微信小程序前端
├── app.json                     # 全局配置（页面路由、tabBar、窗口样式）
├── app.js                       # 入口逻辑（登录、全局状态）
├── app.wxss                     # 全局样式（主题色、通用组件）
├── pages/
│   ├── square/                  # 场景广场（首页 Tab）
│   │   ├── square.wxml          #   场景卡片网格 + 搜索框
│   │   ├── square.wxss          #   卡片样式、搜索栏样式
│   │   ├── square.js            #   场景列表加载、搜索、点击跳转
│   │   └── square.json          #   页面配置
│   ├── generate/                # 生成页（场景工作区）
│   │   ├── generate.wxml        #   两个输入框 + 生成按钮 + 底部入口
│   │   ├── generate.wxss        #   输入框样式、按钮动效
│   │   ├── generate.js          #   表单提交、调用生成 API、跳转结果页
│   │   └── generate.json        #   页面配置
│   ├── result/                  # 生成结果页（核心差异化页面）
│   │   ├── result.wxml          #   风格切换、表达展示、溯源解析、对话链预测
│   │   ├── result.wxss          #   结果卡片、标签、折叠面板样式
│   │   ├── result.js            #   加载结果、切换风格、保存笔记、进入对战
│   │   └── result.json          #   页面配置
│   ├── battle/                  # 模拟对战页
│   │   ├── battle.wxml          #   聊天气泡列表 + 输入区 + 结束复盘
│   │   ├── battle.wxss          #   气泡样式、对手/用户区分
│   │   ├── battle.js            #   对话流转、AI对手调用、回合管理
│   │   └── battle.json          #   页面配置
│   ├── training/                # 训练场（Tab）
│   │   ├── training.wxml        #   模拟对战入口 + 技能拆解卡片 + 历史笔记入口
│   │   ├── training.wxss        #   训练场布局样式
│   │   ├── training.js          #   各入口跳转
│   │   └── training.json        #   页面配置
│   ├── notes/                   # 历史笔记页
│   │   ├── notes.wxml           #   按场景分组的笔记列表 + 搜索
│   │   ├── notes.wxss           #   笔记卡片样式
│   │   ├── notes.js             #   加载笔记、搜索、删除、点击查看详情
│   │   └── notes.json           #   页面配置
│   └── profile/                 # 我的（Tab）
│       ├── profile.wxml         #   用户头像、统计数据、设置入口
│       ├── profile.wxss         #   个人中心样式
│       ├── profile.js           #   加载用户数据、统计
│       └── profile.json         #   页面配置
├── components/
│   ├── scene-card/              # 场景卡片组件（在 square 和 training 中复用）
│   │   ├── scene-card.wxml
│   │   ├── scene-card.wxss
│   │   └── scene-card.js
│   ├── style-tabs/              # 风格切换标签组件（在 result 中复用）
│   │   ├── style-tabs.wxml
│   │   ├── style-tabs.wxss
│   │   └── style-tabs.js
│   └── chat-bubble/             # 聊天气泡组件（在 battle 中复用）
│       ├── chat-bubble.wxml
│       ├── chat-bubble.wxss
│       └── chat-bubble.js
├── utils/
│   ├── api.js                   # 封装 wx.request，统一错误处理
│   └── storage.js               # 本地缓存工具（token、草稿保存）
└── styles/
    └── theme.wxss               # 全局主题变量（暖色系、字体、间距）

server/                          # 后端服务
├── package.json                 # 依赖声明（express、axios、dotenv）
├── src/
│   ├── index.js                 # Express 入口，挂载路由，启动服务
│   ├── routes/
│   │   ├── generate.js          # POST /api/generate    生成表达（含多风格+溯源+预测）
│   │   ├── battle.js            # POST /api/battle/start /api/battle/turn  模拟对战
│   │   ├── notes.js             # GET/POST/DELETE /api/notes  笔记管理
│   │   └── scenes.js            # GET /api/scenes  场景列表 + 搜索
│   ├── services/
│   │   ├── ai.js                # 统一 AI 调用封装（DeepSeek API）
│   │   └── prompts.js           # 所有 System Prompt 模板
│   └── middleware/
│       └── auth.js              # 微信登录态校验中间件
└── .env.example                 # 环境变量模板
```

---

## Task 1: 项目脚手架 — 后端

**Files:**
- Create: `server/package.json`
- Create: `server/.env.example`
- Create: `server/src/index.js`

- [ ] **Step 1: 初始化 package.json**

```bash
cd server && npm init -y
```

- [ ] **Step 2: 安装依赖**

```bash
cd server && npm install express axios dotenv cors
```

- [ ] **Step 3: 写入 package.json（补充 scripts）**

`server/package.json`:
```json
{
  "name": "expression-assistant-server",
  "version": "1.0.0",
  "description": "表达助手微信小程序后端",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js"
  },
  "dependencies": {
    "axios": "^1.7.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "express": "^4.21.0"
  }
}
```

- [ ] **Step 4: 写入 .env.example**

`server/.env.example`:
```
DEEPSEEK_API_KEY=sk-your-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com
PORT=3000
```

- [ ] **Step 5: 写入 Express 入口**

`server/src/index.js`:
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const generateRouter = require('./routes/generate');
const battleRouter = require('./routes/battle');
const notesRouter = require('./routes/notes');
const scenesRouter = require('./routes/scenes');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 公开路由
app.use('/api/scenes', scenesRouter);

// 需要登录的路由
app.use('/api/generate', authMiddleware, generateRouter);
app.use('/api/battle', authMiddleware, battleRouter);
app.use('/api/notes', authMiddleware, notesRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`表达助手服务已启动: http://localhost:${PORT}`);
});
```

- [ ] **Step 6: 创建 .env 并启动验证**

```bash
cp server/.env.example server/.env
# 编辑 server/.env 填入真实 API Key
cd server && npm run dev
```

验证：访问 `http://localhost:3000/api/health` 返回 `{"status":"ok"}`

- [ ] **Step 7: Commit**

```bash
git add server/
git commit -m "feat: scaffold backend with Express + DeepSeek setup"
```

---

## Task 2: 后端 — AI 服务与 Prompt 模板

**Files:**
- Create: `server/src/services/ai.js`
- Create: `server/src/services/prompts.js`

- [ ] **Step 1: 写入 Prompt 模板**

`server/src/services/prompts.js`:
```javascript
// 生成表达的系统 Prompt
function buildGeneratePrompt(scene, opponentView, userThoughts, style) {
  const styleGuides = {
    logical: '使用逻辑拆解的方式：分析对方观点中的逻辑漏洞，用清晰的论点-论据-结论结构组织表达。',
    humorous: '使用幽默化解的方式：用轻松的语气和巧妙的类比化解对方观点，保持友好不冒犯。',
    rhetorical: '使用反问引导的方式：通过提出关键问题让对方反思，引导对方自己发现观点的不足。',
    empathic: '使用情感共鸣的方式：先共情认可对方的部分感受，再温和地引入自己的不同视角。'
  };

  return `你是一个表达教练，擅长帮人组织语言、清晰表达观点。

## 场景背景
用户正在以下场景中与人交流：${scene}

## 对方观点
${opponentView}

## 用户自己的碎片想法
${userThoughts}

## 你的任务
请根据用户选择的表达风格，将用户的碎片想法组织成一段完整、有力、自然的表达。

## 表达风格要求
${styleGuides[style] || styleGuides.logical}

## 输出格式（严格 JSON）
{
  "expression": "组织好的完整表达文本",
  "userSource": ["标记哪些内容来自用户的原始想法"],
  "aiSupplement": ["标记哪些内容是AI补充的事实/数据/技巧"],
  "technique": {
    "name": "使用的表达技巧名称",
    "explanation": "为什么这种技巧在这个场景有效",
    "how_to_apply": "用户以后如何自己运用这个技巧"
  },
  "counterPredictions": [
    {
      "opponentReply": "对方可能如何回击",
      "yourResponse": "你可以怎么应对"
    }
  ]
}`;
}

// 模拟对战的系统 Prompt
function buildBattlePrompt(scene, history) {
  return `你是一个模拟对话中的"强硬但讲理的对手"。你的角色设定：

## 场景
${scene}

## 你的性格
- 你有自己的坚定观点，不会轻易被说服
- 你善于发现对方论据中的漏洞和逻辑问题
- 你保持理性，不会人身攻击，但会毫不客气地质疑
- 你的目标是让对方真正思考，而不是轻松过关
- 你不会迎合对方，你会提出锋利但有道理的反驳

## 对话历史
${history}

## 你的任务
基于对话历史，给出你的下一轮反驳。保持角色一致性。
如果对方的论证有力，你可以承认部分有道理但继续质疑其他方面。
如果对方的论证有漏洞，你要精准指出。

## 输出格式
{
  "reply": "你的反驳内容",
  "attackPoint": "你主要攻击了对方观点的哪个部分",
  "difficulty": "easy/medium/hard - 这一轮反驳的难度"
}`;
}

// 对战复盘的系统 Prompt
function buildDebriefPrompt(history) {
  return `你是一个表达教练，请回顾以下模拟对话，给出复盘分析。

## 对话记录
${history}

## 输出格式（严格 JSON）
{
  "overall": "整体评价（2-3句话）",
  "highlights": [
    { "round": 1, "what": "用户做得好的地方", "why": "为什么好" }
  ],
  "improvements": [
    { "round": 1, "what": "可以改进的地方", "suggestion": "具体改进建议" }
  ],
  "score": { "logic": 7, "empathy": 6, "clarity": 8, "creativity": 5 },
  "tip": "一条最关键的提升建议"
}`;
}

module.exports = { buildGeneratePrompt, buildBattlePrompt, buildDebriefPrompt };
```

- [ ] **Step 2: 写入 AI 调用封装**

`server/src/services/ai.js`:
```javascript
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
```

- [ ] **Step 3: Commit**

```bash
git add server/src/services/
git commit -m "feat: add AI service with prompt templates for generate, battle, debrief"
```

---

## Task 3: 后端 — 认证中间件与场景路由

**Files:**
- Create: `server/src/middleware/auth.js`
- Create: `server/src/routes/scenes.js`

- [ ] **Step 1: 写入认证中间件**

`server/src/middleware/auth.js`:
```javascript
// 微信小程序登录态校验中间件
// MVP 阶段：从请求头读取 openid 或 token，做基础校验
// 后续可接入微信 code2session 接口做正式校验

function authMiddleware(req, res, next) {
  const openid = req.headers['x-user-openid'] || req.headers['authorization'];

  if (!openid) {
    // MVP 阶段使用设备标识作为临时身份
    const deviceId = req.headers['x-device-id'];
    if (!deviceId) {
      return res.status(401).json({ error: '请先登录' });
    }
    req.userId = `device_${deviceId}`;
    return next();
  }

  req.userId = openid;
  next();
}

module.exports = { authMiddleware };
```

- [ ] **Step 2: 写入场景路由**

`server/src/routes/scenes.js`:
```javascript
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
```

- [ ] **Step 3: Commit**

```bash
git add server/src/middleware/ server/src/routes/scenes.js
git commit -m "feat: add auth middleware and scenes API with preset scene library"
```

---

## Task 4: 后端 — 生成表达 API

**Files:**
- Create: `server/src/routes/generate.js`

- [ ] **Step 1: 写入生成路由**

`server/src/routes/generate.js`:
```javascript
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
  const userRecords = generationHistory
    .filter(r => r.userId === req.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(Number(offset), Number(offset) + Number(limit));

  res.json({ records: userRecords, total: userRecords.length });
});

module.exports = router;
```

- [ ] **Step 2: 测试 API**

```bash
# 启动 server 后测试
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -H "X-Device-Id: test123" \
  -d '{
    "scene": "朋友争论",
    "opponentView": "AI根本不行，这东西出错率太高了",
    "userThoughts": "AI进步很快 ChatGPT准确率已经很高了 人也犯错",
    "style": "logical"
  }'
```

预期返回包含 expression、userSource、aiSupplement、technique、counterPredictions 的 JSON。

- [ ] **Step 3: Commit**

```bash
git add server/src/routes/generate.js
git commit -m "feat: add expression generation API with multi-style support"
```

---

## Task 5: 后端 — 模拟对战与笔记 API

**Files:**
- Create: `server/src/routes/battle.js`
- Create: `server/src/routes/notes.js`

- [ ] **Step 1: 写入对战路由**

`server/src/routes/battle.js`:
```javascript
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

  // 记录用户回应
  battle.rounds.push({ role: 'user', content: userResponse });

  // 构建对话历史文本
  const historyText = battle.rounds
    .map(r => `${r.role === 'opponent' ? '对手' : '你'}: ${r.content}`)
    .join('\n');

  try {
    const result = await battleTurn(battle.scene, historyText);
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

module.exports = router;
```

- [ ] **Step 2: 写入笔记路由**

`server/src/routes/notes.js`:
```javascript
const express = require('express');
const router = express.Router();

// 内存存储（MVP 阶段）
const notes = [];

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
```

- [ ] **Step 3: Commit**

```bash
git add server/src/routes/battle.js server/src/routes/notes.js
git commit -m "feat: add battle simulation and notes management APIs"
```

---

## Task 6: 微信小程序 — 全局配置与工具函数

**Files:**
- Create: `miniprogram/app.json`
- Create: `miniprogram/app.js`
- Create: `miniprogram/app.wxss`
- Create: `miniprogram/styles/theme.wxss`
- Create: `miniprogram/utils/api.js`
- Create: `miniprogram/utils/storage.js`
- Create: `miniprogram/project.config.json`

- [ ] **Step 1: 写入 project.config.json**

`miniprogram/project.config.json`:
```json
{
  "description": "表达助手 - 微信小程序",
  "packOptions": { "ignore": [], "include": [] },
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "preloadBackgroundData": false,
    "minified": true,
    "newFeature": false,
    "coverView": true,
    "nodeModules": false,
    "autoAudits": false,
    "showShadowRootInWxmlPanel": true,
    "scopeDataCheck": false,
    "uglifyFileName": false,
    "checkInvalidKey": true,
    "checkSiteMap": true,
    "uploadWithSourceMap": true,
    "compileHotReLoad": false,
    "lazyloadPlaceholderEnable": false,
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "useApiHostProcess": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    },
    "condition": false
  },
  "compileType": "miniprogram",
  "libVersion": "3.6.0",
  "appid": "wx0000000000000000",
  "projectname": "expression-assistant",
  "condition": {}
}
```

- [ ] **Step 2: 写入 app.json**

`miniprogram/app.json`:
```json
{
  "pages": [
    "pages/square/square",
    "pages/training/training",
    "pages/profile/profile",
    "pages/generate/generate",
    "pages/result/result",
    "pages/battle/battle",
    "pages/notes/notes"
  ],
  "window": {
    "navigationBarBackgroundColor": "#FF7A45",
    "navigationBarTitleText": "表达助手",
    "navigationBarTextStyle": "white",
    "backgroundColor": "#FFF7F0",
    "backgroundTextStyle": "light"
  },
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#FF7A45",
    "backgroundColor": "#FFFFFF",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/square/square",
        "text": "场景广场",
        "iconPath": "images/tab-scene.png",
        "selectedIconPath": "images/tab-scene-active.png"
      },
      {
        "pagePath": "pages/training/training",
        "text": "训练场",
        "iconPath": "images/tab-training.png",
        "selectedIconPath": "images/tab-training-active.png"
      },
      {
        "pagePath": "pages/profile/profile",
        "text": "我的",
        "iconPath": "images/tab-profile.png",
        "selectedIconPath": "images/tab-profile-active.png"
      }
    ]
  },
  "style": "v2",
  "sitemapLocation": "sitemap.json"
}
```

- [ ] **Step 3: 写入 app.js**

`miniprogram/app.js`:
```javascript
App({
  onLaunch() {
    // 获取设备标识作为临时用户 ID
    const deviceId = wx.getStorageSync('deviceId');
    if (!deviceId) {
      const newId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      wx.setStorageSync('deviceId', newId);
      this.globalData.deviceId = newId;
    } else {
      this.globalData.deviceId = deviceId;
    }
  },

  globalData: {
    deviceId: null,
    // API 服务器地址 - 开发环境
    apiBase: 'http://localhost:3000',
    // 当前选中的场景
    currentScene: null
  }
});
```

- [ ] **Step 4: 写入 app.wxss**

`miniprogram/app.wxss`:
```css
@import "./styles/theme.wxss";

page {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 28rpx;
  line-height: 1.6;
}

.container {
  padding: 24rpx;
  min-height: 100vh;
  box-sizing: border-box;
}
```

- [ ] **Step 5: 写入 theme.wxss**

`miniprogram/styles/theme.wxss`:
```css
:root {
  /* 暖色系主色调 */
  --color-primary: #FF7A45;
  --color-primary-light: #FFA940;
  --color-primary-dark: #D94838;
  --color-primary-bg: #FFF1E6;

  /* 背景色 */
  --bg-primary: #FFF7F0;
  --bg-white: #FFFFFF;
  --bg-card: #FFFFFF;
  --bg-input: #FFFBF7;

  /* 文字色 */
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-hint: #999999;
  --text-white: #FFFFFF;

  /* 边框与阴影 */
  --border-color: #F0E0D0;
  --shadow-card: 0 4rpx 24rpx rgba(255, 122, 69, 0.08);
  --shadow-hover: 0 8rpx 32rpx rgba(255, 122, 69, 0.15);

  /* 圆角 */
  --radius-sm: 12rpx;
  --radius-md: 20rpx;
  --radius-lg: 28rpx;

  /* 间距 */
  --spacing-xs: 8rpx;
  --spacing-sm: 16rpx;
  --spacing-md: 24rpx;
  --spacing-lg: 32rpx;
  --spacing-xl: 48rpx;

  /* 字体大小 */
  --font-xs: 22rpx;
  --font-sm: 26rpx;
  --font-md: 28rpx;
  --font-lg: 32rpx;
  --font-xl: 36rpx;
  --font-title: 44rpx;
}

/* 通用按钮样式 */
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--text-white);
  border: none;
  border-radius: var(--radius-md);
  padding: 24rpx 48rpx;
  font-size: var(--font-lg);
  font-weight: 600;
  text-align: center;
  box-shadow: 0 8rpx 24rpx rgba(255, 122, 69, 0.3);
}

.btn-primary:active {
  opacity: 0.85;
  transform: scale(0.98);
}

.btn-secondary {
  background: var(--bg-white);
  color: var(--color-primary);
  border: 2rpx solid var(--color-primary);
  border-radius: var(--radius-md);
  padding: 20rpx 40rpx;
  font-size: var(--font-md);
  text-align: center;
}

/* 通用卡片样式 */
.card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: var(--spacing-md);
}

/* 通用输入框样式 */
.input-area {
  background: var(--bg-input);
  border: 2rpx solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20rpx 24rpx;
  font-size: var(--font-md);
  width: 100%;
  box-sizing: border-box;
  min-height: 120rpx;
}

.input-area:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4rpx rgba(255, 122, 69, 0.1);
}

/* 标签样式 */
.tag {
  display: inline-block;
  background: var(--color-primary-bg);
  color: var(--color-primary);
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-size: var(--font-xs);
}
```

- [ ] **Step 6: 写入 api.js 工具**

`miniprogram/utils/api.js`:
```javascript
const app = getApp();

function request(method, path, data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.apiBase + path,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'X-Device-Id': app.globalData.deviceId
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject({ statusCode: res.statusCode, ...res.data });
        }
      },
      fail(err) {
        wx.showToast({ title: '网络连接失败', icon: 'none' });
        reject(err);
      }
    });
  });
}

const api = {
  // 场景
  getScenes(keyword) {
    return request('GET', '/api/scenes' + (keyword ? `?keyword=${keyword}` : ''));
  },

  // 生成表达
  generate(data) {
    return request('POST', '/api/generate', data);
  },

  // 模拟对战
  startBattle(data) {
    return request('POST', '/api/battle/start', data);
  },
  battleTurn(data) {
    return request('POST', '/api/battle/turn', data);
  },
  endBattle(data) {
    return request('POST', '/api/battle/end', data);
  },

  // 笔记
  getNotes(params = {}) {
    const query = Object.keys(params)
      .filter(k => params[k] !== undefined && params[k] !== null)
      .map(k => `${k}=${encodeURIComponent(params[k])}`)
      .join('&');
    return request('GET', '/api/notes' + (query ? `?${query}` : ''));
  },
  saveNote(data) {
    return request('POST', '/api/notes', data);
  },
  deleteNote(id) {
    return request('DELETE', `/api/notes/${id}`);
  },
  toggleStar(id) {
    return request('PATCH', `/api/notes/${id}/star`);
  },

  // 历史
  getHistory(params = {}) {
    const query = Object.keys(params)
      .filter(k => params[k] !== undefined)
      .map(k => `${k}=${encodeURIComponent(params[k])}`)
      .join('&');
    return request('GET', '/api/generate/history' + (query ? `?${query}` : ''));
  }
};

module.exports = api;
```

- [ ] **Step 7: 写入 storage.js 工具**

`miniprogram/utils/storage.js`:
```javascript
function get(key, defaultValue = null) {
  try {
    const value = wx.getStorageSync(key);
    return value !== '' ? value : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function set(key, value) {
  try {
    wx.setStorageSync(key, value);
  } catch (e) {
    console.error('Storage set failed:', e);
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(key);
  } catch (e) {
    console.error('Storage remove failed:', e);
  }
}

// 草稿保存与恢复
function saveDraft(sceneId, data) {
  set(`draft_${sceneId}`, data);
}

function getDraft(sceneId) {
  return get(`draft_${sceneId}`, null);
}

function clearDraft(sceneId) {
  remove(`draft_${sceneId}`);
}

module.exports = { get, set, remove, saveDraft, getDraft, clearDraft };
```

- [ ] **Step 8: 创建占位 tab 图标**

用微信开发者工具或手动在 `miniprogram/images/` 下放置 6 个 81x81 的 PNG 图标：
- `tab-scene.png` / `tab-scene-active.png`
- `tab-training.png` / `tab-training-active.png`
- `tab-profile.png` / `tab-profile-active.png`

> 可使用纯色方块占位，后续替换为正式图标。

- [ ] **Step 9: Commit**

```bash
git add miniprogram/
git commit -m "feat: scaffold mini-program with global config, theme, utils, and tab bar"
```

---

## Task 7: 微信小程序 — 场景卡片组件

**Files:**
- Create: `miniprogram/components/scene-card/scene-card.json`
- Create: `miniprogram/components/scene-card/scene-card.wxml`
- Create: `miniprogram/components/scene-card/scene-card.wxss`
- Create: `miniprogram/components/scene-card/scene-card.js`

- [ ] **Step 1: 写入组件文件**

`miniprogram/components/scene-card/scene-card.json`:
```json
{
  "component": true,
  "usingComponents": {}
}
```

`miniprogram/components/scene-card/scene-card.wxml`:
```xml
<view class="scene-card" bindtap="onTap" hover-class="scene-card--hover">
  <view class="scene-icon">{{icon}}</view>
  <view class="scene-name">{{name}}</view>
  <view class="scene-tags" wx:if="{{tags.length}}">
    <text class="tag" wx:for="{{tags}}" wx:key="*this" wx:for-item="t">{{t}}</text>
  </view>
</view>
```

`miniprogram/components/scene-card/scene-card.wxss`:
```css
.scene-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg) var(--spacing-md);
  box-shadow: var(--shadow-card);
  transition: transform 0.2s, box-shadow 0.2s;
}

.scene-card--hover {
  transform: translateY(-4rpx);
  box-shadow: var(--shadow-hover);
}

.scene-icon {
  font-size: 64rpx;
  margin-bottom: var(--spacing-sm);
}

.scene-name {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.scene-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  justify-content: center;
}

.tag {
  display: inline-block;
  background: var(--color-primary-bg);
  color: var(--color-primary);
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-size: var(--font-xs);
}
```

`miniprogram/components/scene-card/scene-card.js`:
```javascript
Component({
  properties: {
    scene: {
      type: Object,
      value: {}
    },
    icon: {
      type: String,
      value: '💬'
    },
    name: {
      type: String,
      value: ''
    },
    tags: {
      type: Array,
      value: []
    },
    sceneId: {
      type: String,
      value: ''
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('select', {
        id: this.data.sceneId || this.data.scene.id,
        name: this.data.name || this.data.scene.name,
        icon: this.data.icon || this.data.scene.icon
      });
    }
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/components/scene-card/
git commit -m "feat: add scene-card component"
```

---

## Task 8: 微信小程序 — 场景广场页面（首页 Tab）

**Files:**
- Create: `miniprogram/pages/square/square.json`
- Create: `miniprogram/pages/square/square.wxml`
- Create: `miniprogram/pages/square/square.wxss`
- Create: `miniprogram/pages/square/square.js`

- [ ] **Step 1: 写入页面文件**

`miniprogram/pages/square/square.json`:
```json
{
  "navigationBarTitleText": "场景广场",
  "usingComponents": {
    "scene-card": "/components/scene-card/scene-card"
  }
}
```

`miniprogram/pages/square/square.wxml`:
```xml
<view class="container">
  <!-- 头部标题 -->
  <view class="header">
    <view class="header-title">今天想练习什么场景？</view>
    <view class="header-subtitle">选择一个场景，开始提升你的表达力</view>
  </view>

  <!-- 搜索框 -->
  <view class="search-bar">
    <view class="search-icon">🔍</view>
    <input
      class="search-input"
      placeholder="搜索特定场景..."
      value="{{keyword}}"
      bindinput="onSearchInput"
      bindconfirm="onSearch"
      confirm-type="search"
    />
    <view class="search-clear" wx:if="{{keyword}}" bindtap="onClearSearch">✕</view>
  </view>

  <!-- 场景网格 -->
  <view class="scene-grid">
    <scene-card
      wx:for="{{scenes}}"
      wx:key="id"
      icon="{{item.icon}}"
      name="{{item.name}}"
      tags="{{item.tags}}"
      sceneId="{{item.id}}"
      bind:select="onSceneSelect"
    />
  </view>

  <!-- 空状态 -->
  <view class="empty-state" wx:if="{{scenes.length === 0 && !loading}}">
    <view class="empty-icon">🔍</view>
    <view class="empty-text">没有找到"{{keyword}}"相关场景</view>
    <view class="empty-hint">试试其他关键词？</view>
  </view>

  <!-- 加载中 -->
  <view class="loading" wx:if="{{loading}}">
    <view class="loading-spinner"></view>
    <text>加载场景中...</text>
  </view>
</view>
```

`miniprogram/pages/square/square.wxss`:
```css
.header {
  padding: var(--spacing-lg) 0 var(--spacing-md);
}

.header-title {
  font-size: var(--font-title);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.header-subtitle {
  font-size: var(--font-sm);
  color: var(--text-secondary);
}

.search-bar {
  display: flex;
  align-items: center;
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: 16rpx 24rpx;
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-card);
}

.search-icon {
  font-size: 32rpx;
  margin-right: var(--spacing-sm);
}

.search-input {
  flex: 1;
  font-size: var(--font-md);
  border: none;
  background: transparent;
}

.search-clear {
  font-size: 28rpx;
  color: var(--text-hint);
  padding: 8rpx;
}

.scene-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: var(--spacing-md);
}

.empty-text {
  font-size: var(--font-md);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.empty-hint {
  font-size: var(--font-sm);
  color: var(--text-hint);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xl);
  color: var(--text-hint);
}
```

`miniprogram/pages/square/square.js`:
```javascript
const api = require('../../utils/api');

Page({
  data: {
    keyword: '',
    scenes: [],
    loading: true
  },

  onLoad() {
    this.loadScenes();
  },

  onShow() {
    // 每次回到广场时清除当前场景（因为没有在某个场景的工作区中）
    const app = getApp();
    app.globalData.currentScene = null;
  },

  async loadScenes() {
    this.setData({ loading: true });
    try {
      const res = await api.getScenes(this.data.keyword || undefined);
      this.setData({ scenes: res.scenes, loading: false });
    } catch (err) {
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
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

  onSceneSelect(e) {
    const { id, name, icon } = e.detail;
    const app = getApp();
    app.globalData.currentScene = { id, name, icon };
    wx.navigateTo({
      url: `/pages/generate/generate?sceneId=${id}&sceneName=${name}&sceneIcon=${icon}`
    });
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/square/
git commit -m "feat: add scene square page with search and scene grid"
```

---

## Task 9: 微信小程序 — 生成页

**Files:**
- Create: `miniprogram/pages/generate/generate.json`
- Create: `miniprogram/pages/generate/generate.wxml`
- Create: `miniprogram/pages/generate/generate.wxss`
- Create: `miniprogram/pages/generate/generate.js`

- [ ] **Step 1: 写入页面文件**

`miniprogram/pages/generate/generate.json`:
```json
{
  "navigationBarTitleText": "",
  "usingComponents": {}
}
```

`miniprogram/pages/generate/generate.wxml`:
```xml
<view class="container">
  <!-- 场景头部 -->
  <view class="scene-header">
    <view class="scene-badge">{{sceneIcon}} {{sceneName}}</view>
  </view>

  <!-- 输入区 -->
  <view class="input-section">
    <!-- 输入框1：对方观点 -->
    <view class="input-group">
      <view class="input-label">💬 对方说了什么？</view>
      <textarea
        class="input-area"
        placeholder="把对方让你不服、不认可的那句话写进来..."
        value="{{opponentView}}"
        bindinput="onOpponentInput"
        maxlength="500"
        auto-height
      />
      <view class="input-count">{{opponentView.length}}/500</view>
    </view>

    <!-- 连接线 -->
    <view class="connector">
      <view class="connector-line"></view>
      <view class="connector-hint">你的想法会与对方观点融合，生成更有力的表达</view>
    </view>

    <!-- 输入框2：自己的碎片想法 -->
    <view class="input-group">
      <view class="input-label">💭 你的想法（乱一点没关系）</view>
      <textarea
        class="input-area input-thoughts"
        placeholder="把脑子里碎片想法倒出来...无论是关键词、半句话还是情绪都可以"
        value="{{userThoughts}}"
        bindinput="onThoughtsInput"
        maxlength="800"
        auto-height
      />
      <view class="input-actions">
        <view class="input-count">{{userThoughts.length}}/800</view>
        <view class="voice-btn" bindtap="onVoiceInput">
          <text>🎤 语音输入</text>
        </view>
      </view>
    </view>
  </view>

  <!-- 生成按钮 -->
  <button class="btn-primary generate-btn" bindtap="onGenerate" disabled="{{generating}}">
    {{generating ? '正在组织你的想法...' : '✨ 生成表达'}}
  </button>

  <!-- 生成中动画 -->
  <view class="generating-hint" wx:if="{{generating}}">
    <view class="thinking-dots">
      <view class="dot"></view>
      <view class="dot"></view>
      <view class="dot"></view>
    </view>
    <text>AI 正在把你的碎片想法组织成完整表达...</text>
  </view>

  <!-- 底部入口 -->
  <view class="bottom-entries">
    <view class="entry-item" bindtap="onEnterBattle">
      <view class="entry-icon">🥊</view>
      <view class="entry-text">进入这个场景的模拟对战</view>
      <view class="entry-arrow">→</view>
    </view>
    <view class="entry-item" bindtap="onViewNotes">
      <view class="entry-icon">📖</view>
      <view class="entry-text">查看历史笔记</view>
      <view class="entry-arrow">→</view>
    </view>
  </view>
</view>
```

`miniprogram/pages/generate/generate.wxss`:
```css
.scene-header {
  margin-bottom: var(--spacing-lg);
}

.scene-badge {
  display: inline-block;
  background: var(--color-primary-bg);
  color: var(--color-primary-dark);
  padding: 12rpx 28rpx;
  border-radius: var(--radius-lg);
  font-size: var(--font-md);
  font-weight: 600;
}

.input-section {
  margin-bottom: var(--spacing-lg);
}

.input-group {
  margin-bottom: var(--spacing-md);
}

.input-label {
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.input-area {
  background: var(--bg-input);
  border: 2rpx solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20rpx 24rpx;
  font-size: var(--font-md);
  width: 100%;
  box-sizing: border-box;
  min-height: 160rpx;
  transition: border-color 0.2s;
}

.input-area:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4rpx rgba(255, 122, 69, 0.1);
}

.input-thoughts {
  min-height: 200rpx;
}

.input-count {
  font-size: var(--font-xs);
  color: var(--text-hint);
  text-align: right;
  margin-top: 8rpx;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8rpx;
}

.voice-btn {
  font-size: var(--font-sm);
  color: var(--color-primary);
  padding: 8rpx 20rpx;
  background: var(--color-primary-bg);
  border-radius: 20rpx;
}

.connector {
  display: flex;
  align-items: center;
  margin: var(--spacing-sm) 0;
}

.connector-line {
  width: 4rpx;
  height: 40rpx;
  background: linear-gradient(to bottom, var(--color-primary-light), var(--color-primary));
  border-radius: 2rpx;
  margin-right: var(--spacing-sm);
}

.connector-hint {
  font-size: var(--font-xs);
  color: var(--text-hint);
}

.generate-btn {
  width: 100%;
  margin-bottom: var(--spacing-md);
}

.generating-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  color: var(--text-secondary);
  font-size: var(--font-sm);
}

.thinking-dots {
  display: flex;
  gap: 12rpx;
  margin-bottom: var(--spacing-sm);
}

.dot {
  width: 12rpx;
  height: 12rpx;
  background: var(--color-primary);
  border-radius: 50%;
  animation: pulse 0.8s ease-in-out infinite alternate;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes pulse {
  from { opacity: 0.3; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1.2); }
}

.bottom-entries {
  border-top: 2rpx solid var(--border-color);
  padding-top: var(--spacing-md);
}

.entry-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1rpx solid var(--border-color);
}

.entry-item:last-child {
  border-bottom: none;
}

.entry-icon {
  font-size: 40rpx;
  margin-right: var(--spacing-sm);
}

.entry-text {
  flex: 1;
  font-size: var(--font-md);
  color: var(--text-primary);
}

.entry-arrow {
  font-size: var(--font-md);
  color: var(--text-hint);
}
```

`miniprogram/pages/generate/generate.js`:
```javascript
const api = require('../../utils/api');
const storage = require('../../utils/storage');

Page({
  data: {
    sceneId: '',
    sceneName: '',
    sceneIcon: '',
    opponentView: '',
    userThoughts: '',
    generating: false
  },

  onLoad(options) {
    const { sceneId, sceneName, sceneIcon } = options;
    this.setData({
      sceneId: sceneId || '',
      sceneName: decodeURIComponent(sceneName || ''),
      sceneIcon: decodeURIComponent(sceneIcon || '')
    });

    // 设置导航标题
    wx.setNavigationBarTitle({
      title: sceneName ? decodeURIComponent(sceneName) : '生成表达'
    });

    // 恢复草稿
    const draft = storage.getDraft(sceneId);
    if (draft) {
      this.setData({
        opponentView: draft.opponentView || '',
        userThoughts: draft.userThoughts || ''
      });
    }
  },

  onUnload() {
    // 保存草稿
    if (this.data.opponentView || this.data.userThoughts) {
      storage.saveDraft(this.data.sceneId, {
        opponentView: this.data.opponentView,
        userThoughts: this.data.userThoughts
      });
    }
  },

  onOpponentInput(e) {
    this.setData({ opponentView: e.detail.value });
  },

  onThoughtsInput(e) {
    this.setData({ userThoughts: e.detail.value });
  },

  onVoiceInput() {
    // 微信语音识别接口
    wx.startRecord({
      success(res) {
        // 实际项目中使用 wx.getRecorderManager 进行录音
        // MVP 阶段提示用户使用系统键盘语音输入
        wx.showToast({ title: '请使用键盘语音输入', icon: 'none' });
      }
    });
  },

  async onGenerate() {
    const { opponentView, userThoughts } = this.data;

    if (!opponentView.trim()) {
      wx.showToast({ title: '请填写对方的观点', icon: 'none' });
      return;
    }
    if (!userThoughts.trim()) {
      wx.showToast({ title: '请填写你的想法', icon: 'none' });
      return;
    }

    this.setData({ generating: true });

    try {
      const result = await api.generate({
        scene: this.data.sceneName,
        opponentView,
        userThoughts,
        style: 'logical' // 默认逻辑拆解风格，结果页可切换
      });

      // 清除草稿
      storage.clearDraft(this.data.sceneId);

      // 跳转结果页，通过路由参数传递结果
      const params = encodeURIComponent(JSON.stringify({
        sceneName: this.data.sceneName,
        sceneIcon: this.data.sceneIcon,
        opponentView,
        userThoughts,
        result
      }));

      wx.navigateTo({
        url: `/pages/result/result?data=${params}`
      });
    } catch (err) {
      wx.showToast({ title: err.error || '生成失败，请重试', icon: 'none' });
    } finally {
      this.setData({ generating: false });
    }
  },

  onEnterBattle() {
    wx.navigateTo({
      url: `/pages/battle/battle?sceneId=${this.data.sceneId}&sceneName=${encodeURIComponent(this.data.sceneName)}`
    });
  },

  onViewNotes() {
    wx.navigateTo({
      url: `/pages/notes/notes?scene=${encodeURIComponent(this.data.sceneName)}`
    });
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/generate/
git commit -m "feat: add generate page with dual input, voice button, and draft saving"
```

---

## Task 10: 微信小程序 — 生成结果页（核心页面）

**Files:**
- Create: `miniprogram/pages/result/result.json`
- Create: `miniprogram/pages/result/result.wxml`
- Create: `miniprogram/pages/result/result.wxss`
- Create: `miniprogram/pages/result/result.js`

- [ ] **Step 1: 写入页面文件**

`miniprogram/pages/result/result.json`:
```json
{
  "navigationBarTitleText": "生成结果",
  "usingComponents": {
    "style-tabs": "/components/style-tabs/style-tabs"
  }
}
```

`miniprogram/pages/result/result.wxml`:
```xml
<view class="container">
  <!-- 场景标签 -->
  <view class="result-header">
    <view class="result-badge">{{sceneIcon}} {{sceneName}}</view>
    <view class="result-actions">
      <view class="action-btn" bindtap="onCopyAll">📋 复制</view>
      <view class="action-btn" bindtap="onSaveNote">💾 保存</view>
    </view>
  </view>

  <!-- 风格切换标签 -->
  <style-tabs
    currentStyle="{{currentStyle}}"
    bind:change="onStyleChange"
  />

  <!-- 生成表达主体 -->
  <view class="expression-card" wx:if="{{currentData.expression}}">
    <view class="expression-content">{{currentData.expression}}</view>
  </view>

  <!-- 加载中 -->
  <view class="loading-state" wx:if="{{switchingStyle}}">
    <view class="thinking-dots">
      <view class="dot"></view><view class="dot"></view><view class="dot"></view>
    </view>
    <text>切换风格中...</text>
  </view>

  <block wx:if="{{!switchingStyle && currentData.expression}}">
    <!-- 表达解析 - 保真度溯源 -->
    <view class="analysis-section">
      <view class="section-title">🔍 表达解析</view>

      <!-- 来自你的想法 -->
      <view class="source-block user-source" wx:if="{{currentData.userSource.length}}">
        <view class="source-label">✓ 来自你的想法</view>
        <view class="source-item" wx:for="{{currentData.userSource}}" wx:key="*this">
          {{item}}
        </view>
      </view>

      <!-- AI补充 -->
      <view class="source-block ai-source" wx:if="{{currentData.aiSupplement.length}}">
        <view class="source-label">✦ AI 补充的论据</view>
        <view class="source-item" wx:for="{{currentData.aiSupplement}}" wx:key="*this">
          {{item}}
        </view>
      </view>

      <!-- 技巧拆解 -->
      <view class="technique-block" wx:if="{{currentData.technique}}">
        <view class="source-label">💡 {{currentData.technique.name}}</view>
        <view class="technique-detail">{{currentData.technique.explanation}}</view>
        <view class="technique-apply">
          <text class="apply-label">如何运用：</text>
          {{currentData.technique.how_to_apply}}
        </view>
      </view>
    </view>

    <!-- 对话链预测 -->
    <view class="predict-section" wx:if="{{currentData.counterPredictions.length}}">
      <view class="section-title">⚡ 对方可能的回击 & 你的应对</view>
      <view class="predict-item" wx:for="{{currentData.counterPredictions}}" wx:key="opponentReply" wx:for-item="pred">
        <view class="predict-opponent">
          <view class="predict-role">对方可能说：</view>
          <view class="predict-text">{{pred.opponentReply}}</view>
        </view>
        <view class="predict-arrow">↓</view>
        <view class="predict-you">
          <view class="predict-role">你可以回应：</view>
          <view class="predict-text">{{pred.yourResponse}}</view>
        </view>
      </view>
    </view>
  </block>

  <!-- 底部操作 -->
  <view class="result-footer" wx:if="{{!switchingStyle}}">
    <button class="btn-secondary" bindtap="onSaveNote">💾 保存到笔记</button>
    <button class="btn-primary" bindtap="onEnterBattle">🥊 进入模拟对战</button>
  </view>
</view>
```

`miniprogram/pages/result/result.wxss`:
```css
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.result-badge {
  display: inline-block;
  background: var(--color-primary-bg);
  color: var(--color-primary-dark);
  padding: 10rpx 24rpx;
  border-radius: var(--radius-lg);
  font-size: var(--font-sm);
  font-weight: 600;
}

.result-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  font-size: var(--font-sm);
  color: var(--color-primary);
  padding: 8rpx 16rpx;
  background: var(--color-primary-bg);
  border-radius: var(--radius-sm);
}

.expression-card {
  background: linear-gradient(135deg, #FFF7F0, #FFFFFF);
  border: 2rpx solid var(--color-primary-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  position: relative;
}

.expression-card::before {
  content: '💬';
  position: absolute;
  top: -20rpx;
  left: var(--spacing-md);
  font-size: 40rpx;
}

.expression-content {
  font-size: var(--font-lg);
  line-height: 1.8;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.analysis-section {
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: var(--font-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.source-block {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.user-source {
  border-left: 6rpx solid var(--color-primary);
}

.ai-source {
  border-left: 6rpx solid #FFD700;
}

.source-label {
  font-size: var(--font-sm);
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.source-item {
  font-size: var(--font-sm);
  color: var(--text-primary);
  padding: 4rpx 0;
  padding-left: var(--spacing-sm);
}

.technique-block {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  border-left: 6rpx solid #7B68EE;
}

.technique-detail {
  font-size: var(--font-sm);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.6;
}

.technique-apply {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  background: #F8F4FF;
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.apply-label {
  font-weight: 600;
  color: #7B68EE;
}

.predict-section {
  margin-bottom: var(--spacing-lg);
}

.predict-item {
  margin-bottom: var(--spacing-md);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.predict-opponent,
.predict-you {
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-xs);
}

.predict-opponent {
  background: #FFF0F0;
}

.predict-you {
  background: #F0FFF0;
}

.predict-role {
  font-size: var(--font-xs);
  font-weight: 600;
  color: var(--text-hint);
  margin-bottom: 4rpx;
}

.predict-text {
  font-size: var(--font-sm);
  color: var(--text-primary);
  line-height: 1.5;
}

.predict-arrow {
  text-align: center;
  font-size: 24rpx;
  color: var(--color-primary);
  margin: 4rpx 0;
}

.result-footer {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 2rpx solid var(--border-color);
}

.result-footer .btn-secondary,
.result-footer .btn-primary {
  flex: 1;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xl);
  color: var(--text-hint);
}

.thinking-dots {
  display: flex;
  gap: 12rpx;
  margin-bottom: var(--spacing-sm);
}

.dot {
  width: 12rpx;
  height: 12rpx;
  background: var(--color-primary);
  border-radius: 50%;
  animation: pulse 0.8s ease-in-out infinite alternate;
}
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes pulse {
  from { opacity: 0.3; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1.2); }
}
```

`miniprogram/pages/result/result.js`:
```javascript
const api = require('../../utils/api');

Page({
  data: {
    sceneName: '',
    sceneIcon: '',
    opponentView: '',
    userThoughts: '',
    currentStyle: 'logical',
    switchingStyle: false,
    // 缓存所有风格的生成结果
    styleResults: {},
    // 当前展示的数据
    currentData: { expression: '', userSource: [], aiSupplement: [], technique: null, counterPredictions: [] }
  },

  onLoad(options) {
    const rawData = decodeURIComponent(options.data || '{}');
    const parsed = JSON.parse(rawData);

    this.setData({
      sceneName: parsed.sceneName || '',
      sceneIcon: parsed.sceneIcon || '',
      opponentView: parsed.opponentView || '',
      userThoughts: parsed.userThoughts || '',
      styleResults: {
        logical: parsed.result
      },
      currentData: parsed.result
    });
  },

  async onStyleChange(e) {
    const newStyle = e.detail.style;
    if (newStyle === this.data.currentStyle) return;

    // 检查缓存
    if (this.data.styleResults[newStyle]) {
      this.setData({
        currentStyle: newStyle,
        currentData: this.data.styleResults[newStyle]
      });
      return;
    }

    // 请求新风格
    this.setData({ switchingStyle: true });
    try {
      const result = await api.generate({
        scene: this.data.sceneName,
        opponentView: this.data.opponentView,
        userThoughts: this.data.userThoughts,
        style: newStyle
      });

      const styleResults = { ...this.data.styleResults, [newStyle]: result };
      this.setData({
        currentStyle: newStyle,
        styleResults,
        currentData: result,
        switchingStyle: false
      });
    } catch (err) {
      wx.showToast({ title: '切换失败', icon: 'none' });
      this.setData({ switchingStyle: false });
    }
  },

  onCopyAll() {
    const text = this.data.currentData.expression;
    wx.setClipboardData({
      data: text,
      success() {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  },

  async onSaveNote() {
    try {
      await api.saveNote({
        scene: this.data.sceneName,
        opponentView: this.data.opponentView,
        userThoughts: this.data.userThoughts,
        style: this.data.currentStyle,
        expression: this.data.currentData.expression,
        technique: this.data.currentData.technique,
        counterPredictions: this.data.currentData.counterPredictions
      });
      wx.showToast({ title: '已保存到笔记', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  onEnterBattle() {
    const topic = this.data.opponentView;
    wx.navigateTo({
      url: `/pages/battle/battle?sceneName=${encodeURIComponent(this.data.sceneName)}&topic=${encodeURIComponent(topic)}`
    });
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/result/
git commit -m "feat: add result page with multi-style switching, fidelity tracing, and dialogue prediction"
```

---

## Task 11: 微信小程序 — 风格切换 + 聊天气泡组件

**Files:**
- Create: `miniprogram/components/style-tabs/style-tabs.json`
- Create: `miniprogram/components/style-tabs/style-tabs.wxml`
- Create: `miniprogram/components/style-tabs/style-tabs.wxss`
- Create: `miniprogram/components/style-tabs/style-tabs.js`
- Create: `miniprogram/components/chat-bubble/chat-bubble.json`
- Create: `miniprogram/components/chat-bubble/chat-bubble.wxml`
- Create: `miniprogram/components/chat-bubble/chat-bubble.wxss`
- Create: `miniprogram/components/chat-bubble/chat-bubble.js`

- [ ] **Step 1: 写入风格切换组件**

`miniprogram/components/style-tabs/style-tabs.json`:
```json
{ "component": true, "usingComponents": {} }
```

`miniprogram/components/style-tabs/style-tabs.wxml`:
```xml
<scroll-view class="style-tabs" scroll-x enable-flex>
  <view
    class="tab-item {{currentStyle === item.value ? 'tab-item--active' : ''}}"
    wx:for="{{styles}}"
    wx:key="value"
    data-style="{{item.value}}"
    bindtap="onSelect"
  >
    <view class="tab-icon">{{item.icon}}</view>
    <view class="tab-name">{{item.name}}</view>
    <view class="tab-desc">{{item.desc}}</view>
  </view>
</scroll-view>
```

`miniprogram/components/style-tabs/style-tabs.wxss`:
```css
.style-tabs {
  display: flex;
  white-space: nowrap;
  padding: var(--spacing-sm) 0;
  margin-bottom: var(--spacing-md);
}

.tab-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 28rpx;
  margin-right: var(--spacing-sm);
  background: var(--bg-white);
  border: 2rpx solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all 0.2s;
  min-width: 140rpx;
}

.tab-item--active {
  background: linear-gradient(135deg, var(--color-primary-bg), #FFF0E0);
  border-color: var(--color-primary);
  box-shadow: 0 4rpx 16rpx rgba(255, 122, 69, 0.15);
}

.tab-icon {
  font-size: 36rpx;
  margin-bottom: 4rpx;
}

.tab-name {
  font-size: var(--font-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.tab-desc {
  font-size: var(--font-xs);
  color: var(--text-hint);
  margin-top: 2rpx;
}
```

`miniprogram/components/style-tabs/style-tabs.js`:
```javascript
Component({
  properties: {
    currentStyle: { type: String, value: 'logical' }
  },

  data: {
    styles: [
      { value: 'logical', name: '逻辑拆解', icon: '🧠', desc: '论据清晰' },
      { value: 'humorous', name: '幽默化解', icon: '😄', desc: '轻松有力' },
      { value: 'rhetorical', name: '反问引导', icon: '❓', desc: '引人思考' },
      { value: 'empathic', name: '情感共鸣', icon: '💛', desc: '温和坚定' }
    ]
  },

  methods: {
    onSelect(e) {
      const style = e.currentTarget.dataset.style;
      this.triggerEvent('change', { style });
    }
  }
});
```

- [ ] **Step 2: 写入聊天气泡组件**

`miniprogram/components/chat-bubble/chat-bubble.json`:
```json
{ "component": true, "usingComponents": {} }
```

`miniprogram/components/chat-bubble/chat-bubble.wxml`:
```xml
<view class="bubble-wrapper {{role === 'opponent' ? 'bubble--left' : 'bubble--right'}}">
  <view class="bubble-avatar">{{role === 'opponent' ? '🤖' : '👤'}}</view>
  <view class="bubble-body">
    <view class="bubble-name">{{role === 'opponent' ? '对手' : '你'}}</view>
    <view class="bubble-content">{{content}}</view>
    <view class="bubble-meta" wx:if="{{attackPoint}}">
      <text class="meta-tag">攻击点：{{attackPoint}}</text>
    </view>
  </view>
</view>
```

`miniprogram/components/chat-bubble/chat-bubble.wxss`:
```css
.bubble-wrapper {
  display: flex;
  margin-bottom: var(--spacing-md);
  align-items: flex-start;
}

.bubble--left {
  flex-direction: row;
}

.bubble--right {
  flex-direction: row-reverse;
}

.bubble-avatar {
  font-size: 48rpx;
  margin: 0 var(--spacing-sm);
  flex-shrink: 0;
}

.bubble-body {
  max-width: 75%;
}

.bubble-name {
  font-size: var(--font-xs);
  color: var(--text-hint);
  margin-bottom: 4rpx;
}

.bubble-content {
  padding: 20rpx 24rpx;
  border-radius: var(--radius-md);
  font-size: var(--font-md);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.bubble--left .bubble-content {
  background: var(--bg-white);
  border: 1rpx solid var(--border-color);
  border-top-left-radius: 4rpx;
}

.bubble--right .bubble-content {
  background: linear-gradient(135deg, var(--color-primary-bg), #FFE8D6);
  border-top-right-radius: 4rpx;
}

.bubble-meta {
  margin-top: 6rpx;
}

.meta-tag {
  font-size: var(--font-xs);
  color: var(--color-primary);
  background: var(--color-primary-bg);
  padding: 2rpx 10rpx;
  border-radius: 4rpx;
}
```

`miniprogram/components/chat-bubble/chat-bubble.js`:
```javascript
Component({
  properties: {
    role: { type: String, value: 'user' },
    content: { type: String, value: '' },
    attackPoint: { type: String, value: '' }
  }
});
```

- [ ] **Step 3: Commit**

```bash
git add miniprogram/components/style-tabs/ miniprogram/components/chat-bubble/
git commit -m "feat: add style-tabs and chat-bubble components"
```

---

## Task 12: 微信小程序 — 模拟对战页面

**Files:**
- Create: `miniprogram/pages/battle/battle.json`
- Create: `miniprogram/pages/battle/battle.wxml`
- Create: `miniprogram/pages/battle/battle.wxss`
- Create: `miniprogram/pages/battle/battle.js`

- [ ] **Step 1: 写入对战页面**

`miniprogram/pages/battle/battle.json`:
```json
{
  "navigationBarTitleText": "模拟对战",
  "usingComponents": {
    "chat-bubble": "/components/chat-bubble/chat-bubble"
  }
}
```

`miniprogram/pages/battle/battle.wxml`:
```xml
<view class="battle-container">
  <!-- 对战信息栏 -->
  <view class="battle-bar">
    <view class="battle-scene">🎯 {{sceneName}}</view>
    <view class="battle-round">第 {{currentRound}} 轮</view>
  </view>

  <!-- 聊天区域 -->
  <scroll-view class="chat-area" scroll-y scroll-into-view="msg-{{messages.length - 1}}" scroll-with-animation>
    <view wx:for="{{messages}}" wx:key="index" id="msg-{{index}}">
      <chat-bubble
        role="{{item.role}}"
        content="{{item.content}}"
        attackPoint="{{item.attackPoint}}"
      />
    </view>

    <!-- AI 思考中 -->
    <view class="typing-indicator" wx:if="{{waiting}}">
      <view class="typing-dot"></view>
      <view class="typing-dot"></view>
      <view class="typing-dot"></view>
      <text>对手正在思考...</text>
    </view>
  </scroll-view>

  <!-- 输入区 -->
  <view class="battle-input-area" wx:if="{{!battleEnded}}">
    <!-- 碎片想法输入 -->
    <view class="quick-input" wx:if="{{showThoughtInput}}">
      <textarea
        class="quick-textarea"
        placeholder="你的碎片想法（可选）..."
        value="{{quickThought}}"
        bindinput="onQuickThought"
        maxlength="300"
        auto-height
      />
    </view>

    <!-- 操作按钮 -->
    <view class="battle-actions">
      <view class="action-row">
        <button class="btn-action btn-thought" bindtap="onToggleThought">
          💭 {{showThoughtInput ? '收起' : '写想法'}}
        </button>
        <button class="btn-action btn-generate" bindtap="onGenerateResponse" disabled="{{waiting}}">
          ✨ 生成回应
        </button>
        <button class="btn-action btn-manual" bindtap="onManualInput">
          ✍️ 自己打
        </button>
      </view>
    </view>
  </view>

  <!-- 手动输入弹层（简化实现：直接在当前页面切换输入模式） -->
  <view class="manual-input-overlay" wx:if="{{manualMode}}">
    <view class="manual-input-card">
      <view class="manual-title">✍️ 手动输入你的回应</view>
      <textarea
        class="manual-textarea"
        placeholder="写出你的回应..."
        value="{{manualText}}"
        bindinput="onManualText"
        maxlength="1000"
        auto-focus
      />
      <view class="manual-actions">
        <button class="btn-secondary" bindtap="onCancelManual">取消</button>
        <button class="btn-primary" bindtap="onSendManual" disabled="{{!manualText.trim()}}">发送</button>
      </view>
    </view>
  </view>

  <!-- 结束对战按钮 -->
  <view class="end-battle-btn" wx:if="{{messages.length > 2 && !battleEnded}}">
    <button class="btn-secondary" bindtap="onEndBattle">🏳️ 结束对战 & 查看复盘</button>
  </view>

  <!-- 复盘弹层 -->
  <view class="debrief-overlay" wx:if="{{showDebrief}}">
    <scroll-view class="debrief-card" scroll-y>
      <view class="debrief-title">📊 对战复盘</view>
      <view class="debrief-overall">{{debrief.overall}}</view>

      <!-- 亮点 -->
      <view class="debrief-section" wx:if="{{debrief.highlights.length}}">
        <view class="debrief-subtitle">✅ 亮点</view>
        <view class="debrief-item" wx:for="{{debrief.highlights}}" wx:key="round" wx:for-item="h">
          <view class="debrief-round-tag">第{{h.round}}轮</view>
          <view class="debrief-what">{{h.what}}</view>
          <view class="debrief-why">{{h.why}}</view>
        </view>
      </view>

      <!-- 改进 -->\n      <view class=\"debrief-section\" wx:if=\"{{debrief.improvements.length}}\">
        <view class="debrief-subtitle">🔧 可改进</view>
        <view class="debrief-item" wx:for="{{debrief.improvements}}" wx:key="round" wx:for-item="imp">
          <view class="debrief-round-tag">第{{imp.round}}轮</view>
          <view class="debrief-what">{{imp.what}}</view>
          <view class="debrief-suggestion">💡 {{imp.suggestion}}</view>
        </view>
      </view>

      <!-- 评分 -->
      <view class="score-section" wx:if="{{debrief.score}}">
        <view class="debrief-subtitle">📈 能力评分</view>
        <view class="score-grid">
          <view class="score-item" wx:for="{{scoreList}}" wx:key="key">
            <view class="score-name">{{item.label}}</view>
            <view class="score-bar-bg">
              <view class="score-bar-fill" style="width: {{item.value * 10}}%"></view>
            </view>
            <view class="score-num">{{item.value}}</view>
          </view>
        </view>
      </view>

      <!-- 关键建议 -->
      <view class="debrief-tip" wx:if="{{debrief.tip}}">
        <view class="tip-label">💡 关键建议</view>
        <view class="tip-text">{{debrief.tip}}</view>
      </view>

      <button class="btn-primary" bindtap="onCloseDebrief">完成</button>
    </scroll-view>
  </view>
</view>
```

`miniprogram/pages/battle/battle.wxss`:
```css
.battle-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-primary);
}

.battle-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-white);
  border-bottom: 1rpx solid var(--border-color);
}

.battle-scene { font-weight: 600; font-size: var(--font-md); }
.battle-round { font-size: var(--font-sm); color: var(--color-primary); }

.chat-area {
  flex: 1;
  padding: var(--spacing-md);
  overflow-y: auto;
}

.typing-indicator {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  color: var(--text-hint);
  font-size: var(--font-sm);
  gap: 8rpx;
}

.typing-dot {
  width: 10rpx; height: 10rpx;
  background: var(--text-hint);
  border-radius: 50%;
  animation: pulse 0.8s ease-in-out infinite alternate;
}
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes pulse {
  from { opacity: 0.3; }
  to { opacity: 1; }
}

.battle-input-area {
  background: var(--bg-white);
  border-top: 1rpx solid var(--border-color);
  padding: var(--spacing-sm) var(--spacing-md);
  padding-bottom: calc(var(--spacing-md) + env(safe-area-inset-bottom));
}

.quick-textarea {
  width: 100%;
  background: var(--bg-input);
  border-radius: var(--radius-sm);
  padding: 12rpx 16rpx;
  font-size: var(--font-sm);
  min-height: 80rpx;
  margin-bottom: var(--spacing-sm);
}

.action-row {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-action {
  flex: 1;
  font-size: var(--font-sm);
  padding: 16rpx 0;
  border-radius: var(--radius-sm);
  text-align: center;
}

.btn-thought { background: var(--bg-input); color: var(--text-secondary); border: none; }
.btn-generate { background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light)); color: white; border: none; }
.btn-manual { background: var(--bg-white); color: var(--color-primary); border: 2rpx solid var(--color-primary); }

.end-battle-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-white);
  border-top: 1rpx solid var(--border-color);
}

.manual-input-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-end;
  z-index: 100;
}

.manual-input-card {
  width: 100%;
  background: var(--bg-white);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding: var(--spacing-lg);
}

.manual-title { font-size: var(--font-lg); font-weight: 600; margin-bottom: var(--spacing-md); }
.manual-textarea { width: 100%; min-height: 200rpx; background: var(--bg-input); border-radius: var(--radius-sm); padding: var(--spacing-sm); font-size: var(--font-md); }
.manual-actions { display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-md); }
.manual-actions .btn-secondary, .manual-actions .btn-primary { flex: 1; }

/* Debrief overlay */
.debrief-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.debrief-card {
  width: 85vw;
  max-height: 80vh;
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.debrief-title { font-size: var(--font-xl); font-weight: 700; text-align: center; margin-bottom: var(--spacing-md); }
.debrief-overall { font-size: var(--font-md); color: var(--text-secondary); margin-bottom: var(--spacing-md); line-height: 1.6; }
.debrief-section { margin-bottom: var(--spacing-md); }
.debrief-subtitle { font-size: var(--font-md); font-weight: 600; margin-bottom: var(--spacing-sm); }
.debrief-item { background: var(--bg-primary); border-radius: var(--radius-sm); padding: var(--spacing-sm); margin-bottom: var(--spacing-sm); }
.debrief-round-tag { font-size: var(--font-xs); color: var(--color-primary); margin-bottom: 4rpx; }
.debrief-what { font-size: var(--font-sm); margin-bottom: 4rpx; }
.debrief-why { font-size: var(--font-xs); color: var(--text-hint); }
.debrief-suggestion { font-size: var(--font-xs); color: var(--color-primary); }

.score-section { margin-bottom: var(--spacing-md); }
.score-grid { display: flex; flex-direction: column; gap: var(--spacing-sm); }
.score-item { display: flex; align-items: center; gap: var(--spacing-sm); }
.score-name { font-size: var(--font-sm); width: 100rpx; }
.score-bar-bg { flex: 1; height: 12rpx; background: var(--border-color); border-radius: 6rpx; overflow: hidden; }
.score-bar-fill { height: 100%; background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light)); border-radius: 6rpx; transition: width 0.5s; }
.score-num { font-size: var(--font-sm); font-weight: 600; width: 40rpx; text-align: right; }

.debrief-tip { background: var(--color-primary-bg); border-radius: var(--radius-sm); padding: var(--spacing-sm); margin-bottom: var(--spacing-md); }
.tip-label { font-size: var(--font-sm); font-weight: 600; margin-bottom: 4rpx; }
.tip-text { font-size: var(--font-sm); color: var(--text-primary); }
```

`miniprogram/pages/battle/battle.js`:
```javascript
const api = require('../../utils/api');

Page({
  data: {
    sceneName: '',
    topic: '',
    battleId: null,
    messages: [],
    currentRound: 1,
    waiting: false,
    battleEnded: false,
    showThoughtInput: false,
    quickThought: '',
    manualMode: false,
    manualText: '',
    showDebrief: false,
    debrief: {},
    scoreList: []
  },

  onLoad(options) {
    const sceneName = decodeURIComponent(options.sceneName || '日常对话');
    const topic = decodeURIComponent(options.topic || '');
    this.setData({ sceneName, topic });
    this.startBattle();
  },

  async startBattle() {
    this.setData({ waiting: true });
    try {
      const res = await api.startBattle({
        scene: this.data.sceneName,
        topic: this.data.topic || '一个你关心的话题'
      });
      this.setData({
        battleId: res.battleId,
        messages: [{ role: 'opponent', content: res.message }],
        currentRound: 1,
        waiting: false
      });
    } catch (err) {
      wx.showToast({ title: '开始对战失败', icon: 'none' });
      this.setData({ waiting: false });
    }
  },

  onToggleThought() {
    this.setData({ showThoughtInput: !this.data.showThoughtInput });
  },

  onQuickThought(e) {
    this.setData({ quickThought: e.detail.value });
  },

  async onGenerateResponse() {
    if (this.data.waiting) return;
    const quickThought = this.data.quickThought;
    // 用用户的碎片想法作为回应
    const userResponse = quickThought || '我不同意你的看法，让我想想怎么说。';
    await this.sendTurn(userResponse);
  },

  async sendTurn(userResponse) {
    this.setData({ waiting: true, showThoughtInput: false, quickThought: '' });

    // 添加用户消息
    const messages = [...this.data.messages, { role: 'user', content: userResponse }];
    this.setData({ messages });

    try {
      const res = await api.battleTurn({
        battleId: this.data.battleId,
        userResponse
      });

      this.setData({
        messages: res.history.map(r => ({
          role: r.role,
          content: r.content,
          attackPoint: r.role === 'opponent' ? r.attackPoint : ''
        })),
        currentRound: res.round,
        waiting: false
      });
    } catch (err) {
      wx.showToast({ title: '回合失败', icon: 'none' });
      this.setData({ waiting: false });
    }
  },

  onManualInput() {
    this.setData({ manualMode: true, manualText: '' });
  },

  onManualText(e) {
    this.setData({ manualText: e.detail.value });
  },

  onCancelManual() {
    this.setData({ manualMode: false });
  },

  async onSendManual() {
    const text = this.data.manualText.trim();
    if (!text) return;
    this.setData({ manualMode: false });
    await this.sendTurn(text);
  },

  async onEndBattle() {
    if (this.data.battleEnded) return;
    this.setData({ waiting: true });

    try {
      const res = await api.endBattle({ battleId: this.data.battleId });
      const scoreList = res.debrief.score ? [
        { key: 'logic', label: '逻辑力', value: res.debrief.score.logic },
        { key: 'empathy', label: '共情力', value: res.debrief.score.empathy },
        { key: 'clarity', label: '清晰度', value: res.debrief.score.clarity },
        { key: 'creativity', label: '创造力', value: res.debrief.score.creativity }
      ] : [];

      this.setData({
        battleEnded: true,
        waiting: false,
        showDebrief: true,
        debrief: res.debrief,
        scoreList
      });
    } catch (err) {
      wx.showToast({ title: '复盘生成失败', icon: 'none' });
      this.setData({ waiting: false });
    }
  },

  onCloseDebrief() {
    this.setData({ showDebrief: false });
    wx.navigateBack();
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/battle/
git commit -m "feat: add battle page with multi-turn simulation, manual input, and debrief"
```

---

## Task 13: 微信小程序 — 训练场 + 笔记 + 我的页面

**Files:**
- Create: `miniprogram/pages/training/training.{json,wxml,wxss,js}`
- Create: `miniprogram/pages/notes/notes.{json,wxml,wxss,js}`
- Create: `miniprogram/pages/profile/profile.{json,wxml,wxss,js}`

- [ ] **Step 1: 写入训练场页面**

`miniprogram/pages/training/training.json`:
```json
{
  "navigationBarTitleText": "训练场",
  "usingComponents": {
    "scene-card": "/components/scene-card/scene-card"
  }
}
```

`miniprogram/pages/training/training.wxml`:
```xml
<view class="container">
  <view class="header">
    <view class="header-title">训练场</view>
    <view class="header-subtitle">系统提升你的表达能力</view>
  </view>

  <!-- 模拟对战入口 -->
  <view class="section">
    <view class="section-title">🥊 模拟对战</view>
    <view class="section-desc">选择场景，AI 扮演强硬对手与你多轮对抗</view>
    <view class="scene-grid">
      <scene-card
        wx:for="{{hotScenes}}"
        wx:key="id"
        icon="{{item.icon}}"
        name="{{item.name}}"
        tags="{{item.tags}}"
        sceneId="{{item.id}}"
        bind:select="onBattleScene"
      />
    </view>
  </view>

  <!-- 技能拆解 -->
  <view class="section">
    <view class="section-title">🎯 技能拆解</view>
    <view class="section-desc">针对不同表达维度进行专项练习</view>
    <view class="skill-cards">
      <view class="skill-card" wx:for="{{skills}}" wx:key="key" bindtap="onSkillTap" data-skill="{{item.key}}">
        <view class="skill-icon">{{item.icon}}</view>
        <view class="skill-name">{{item.name}}</view>
        <view class="skill-desc">{{item.desc}}</view>
        <view class="skill-progress">
          <view class="progress-bar">
            <view class="progress-fill" style="width: {{item.progress}}%"></view>
          </view>
          <text>{{item.progress}}%</text>
        </view>
      </view>
    </view>
  </view>

  <!-- 历史笔记 -->
  <view class="section">
    <view class="section-title">📖 历史笔记</view>
    <view class="section-desc">查看你保存的所有表达记录</view>
    <button class="btn-secondary" bindtap="onViewNotes">查看全部笔记 →</button>
  </view>
</view>
```

`miniprogram/pages/training/training.wxss`:
```css
.header { padding: var(--spacing-lg) 0 var(--spacing-md); }
.header-title { font-size: var(--font-title); font-weight: 700; }
.header-subtitle { font-size: var(--font-sm); color: var(--text-secondary); margin-top: var(--spacing-xs); }

.section { margin-bottom: var(--spacing-xl); }
.section-title { font-size: var(--font-xl); font-weight: 700; margin-bottom: var(--spacing-xs); }
.section-desc { font-size: var(--font-sm); color: var(--text-secondary); margin-bottom: var(--spacing-md); }

.scene-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md); }

.skill-cards { display: flex; flex-direction: column; gap: var(--spacing-sm); }

.skill-card {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-card);
  gap: var(--spacing-sm);
}

.skill-icon { font-size: 48rpx; }
.skill-name { font-size: var(--font-md); font-weight: 600; min-width: 120rpx; }
.skill-desc { font-size: var(--font-xs); color: var(--text-hint); flex: 1; }
.skill-progress { display: flex; align-items: center; gap: var(--spacing-xs); }
.progress-bar { width: 80rpx; height: 8rpx; background: var(--border-color); border-radius: 4rpx; overflow: hidden; }
.progress-fill { height: 100%; background: var(--color-primary); border-radius: 4rpx; }
```

`miniprogram/pages/training/training.js`:
```javascript
const api = require('../../utils/api');

Page({
  data: {
    hotScenes: [],
    skills: [
      { key: 'logic', icon: '🧠', name: '逻辑力', desc: '结构化表达，清晰论证', progress: 30 },
      { key: 'empathy', icon: '💛', name: '共情力', desc: '情感连接，理解他人', progress: 20 },
      { key: 'rebuttal', icon: '⚔️', name: '反驳力', desc: '拆解逻辑，精准回击', progress: 15 },
      { key: 'humor', icon: '😄', name: '幽默力', desc: '化解僵局，轻松表达', progress: 10 }
    ]
  },

  async onLoad() {
    try {
      const res = await api.getScenes();
      this.setData({ hotScenes: res.scenes.slice(0, 6) });
    } catch (err) { /* 使用预设场景 */ }
  },

  onBattleScene(e) {
    const { id, name } = e.detail;
    wx.navigateTo({
      url: `/pages/battle/battle?sceneName=${encodeURIComponent(name)}&topic=`
    });
  },

  onSkillTap(e) {
    const skill = e.currentTarget.dataset.skill;
    wx.showToast({ title: `「${skill}」专项练习即将上线`, icon: 'none' });
  },

  onViewNotes() {
    wx.navigateTo({ url: '/pages/notes/notes' });
  }
});
```

- [ ] **Step 2: 写入历史笔记页面**

`miniprogram/pages/notes/notes.json`:
```json
{ "navigationBarTitleText": "历史笔记", "usingComponents": {} }
```

`miniprogram/pages/notes/notes.wxml`:
```xml
<view class="container">
  <view class="search-bar">
    <input class="search-input" placeholder="搜索笔记..." value="{{keyword}}" bindinput="onSearchInput" bindconfirm="onSearch" confirm-type="search" />
    <view class="search-icon">🔍</view>
  </view>

  <view class="notes-list">
    <view class="note-card" wx:for="{{notes}}" wx:key="id">
      <view class="note-header">
        <view class="note-scene">{{item.scene}}</view>
        <view class="note-time">{{item.savedAt}}</view>
      </view>
      <view class="note-expression">{{item.expression}}</view>
      <view class="note-footer">
        <view class="note-style tag">{{item.style === 'logical' ? '逻辑拆解' : item.style === 'humorous' ? '幽默化解' : item.style === 'rhetorical' ? '反问引导' : '情感共鸣'}}</view>
        <view class="note-actions">
          <text class="note-star {{item.starred ? 'starred' : ''}}" bindtap="onToggleStar" data-id="{{item.id}}">{{item.starred ? '⭐' : '☆'}}</text>
          <text class="note-delete" bindtap="onDeleteNote" data-id="{{item.id}}">🗑️</text>
        </view>
      </view>
    </view>

    <view class="empty-state" wx:if="{{notes.length === 0 && !loading}}">
      <view class="empty-icon">📝</view>
      <view class="empty-text">还没有保存笔记</view>
      <view class="empty-hint">在生成表达后点击"保存到笔记"</view>
    </view>
  </view>
</view>
```

`miniprogram/pages/notes/notes.wxss`:
```css
.search-bar {
  display: flex; align-items: center;
  background: var(--bg-white); border-radius: var(--radius-lg);
  padding: 16rpx 24rpx; margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-card);
}
.search-input { flex: 1; border: none; font-size: var(--font-md); background: transparent; }
.search-icon { font-size: 32rpx; }

.notes-list { display: flex; flex-direction: column; gap: var(--spacing-md); }

.note-card {
  background: var(--bg-card); border-radius: var(--radius-md);
  padding: var(--spacing-md); box-shadow: var(--shadow-card);
}
.note-header { display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm); }
.note-scene { font-weight: 600; font-size: var(--font-sm); color: var(--color-primary); }
.note-time { font-size: var(--font-xs); color: var(--text-hint); }
.note-expression { font-size: var(--font-md); color: var(--text-primary); line-height: 1.6; margin-bottom: var(--spacing-sm);
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.note-footer { display: flex; justify-content: space-between; align-items: center; }
.note-actions { display: flex; gap: var(--spacing-sm); }
.note-star { font-size: 32rpx; }
.note-delete { font-size: 32rpx; }
.note-star.starred { color: #FFA940; }

.empty-state { text-align: center; padding: var(--spacing-xl); }
.empty-icon { font-size: 80rpx; margin-bottom: var(--spacing-md); }
.empty-text { font-size: var(--font-md); color: var(--text-secondary); }
.empty-hint { font-size: var(--font-sm); color: var(--text-hint); }
```

`miniprogram/pages/notes/notes.js`:
```javascript
const api = require('../../utils/api');

Page({
  data: { keyword: '', notes: [], loading: true },

  onLoad(options) {
    if (options.scene) {
      this.setData({ keyword: decodeURIComponent(options.scene) });
    }
    this.loadNotes();
  },

  async loadNotes() {
    this.setData({ loading: true });
    try {
      const params = {};
      if (this.data.keyword) params.keyword = this.data.keyword;
      const res = await api.getNotes(params);
      this.setData({
        notes: res.notes.map(n => ({
          ...n,
          savedAt: n.savedAt ? n.savedAt.slice(0, 10) : ''
        })),
        loading: false
      });
    } catch (err) {
      this.setData({ loading: false });
    }
  },

  onSearchInput(e) { this.setData({ keyword: e.detail.value }); },
  onSearch() { this.loadNotes(); },

  async onToggleStar(e) {
    const id = e.currentTarget.dataset.id;
    try {
      await api.toggleStar(id);
      const notes = this.data.notes.map(n =>
        n.id === id ? { ...n, starred: !n.starred } : n
      );
      this.setData({ notes });
    } catch (err) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  async onDeleteNote(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.deleteNote(id);
            this.setData({
              notes: this.data.notes.filter(n => n.id !== id)
            });
          } catch (err) {
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  }
});
```

- [ ] **Step 3: 写入"我的"页面**

`miniprogram/pages/profile/profile.json`:
```json
{ "navigationBarTitleText": "我的", "usingComponents": {} }
```

`miniprogram/pages/profile/profile.wxml`:
```xml
<view class="container">
  <view class="profile-header">
    <view class="avatar">👤</view>
    <view class="profile-name">表达练习者</view>
    <view class="profile-desc">每一次表达，都是成长</view>
  </view>

  <view class="stats-grid">
    <view class="stat-card">
      <view class="stat-num">{{stats.totalGenerations}}</view>
      <view class="stat-label">生成次数</view>
    </view>
    <view class="stat-card">
      <view class="stat-num">{{stats.totalBattles}}</view>
      <view class="stat-label">对战局数</view>
    </view>
    <view class="stat-card">
      <view class="stat-num">{{stats.totalNotes}}</view>
      <view class="stat-label">保存笔记</view>
    </view>
  </view>

  <view class="menu-section">
    <view class="menu-item" bindtap="onViewNotes">
      <view class="menu-icon">📖</view>
      <view class="menu-text">我的笔记</view>
      <view class="menu-arrow">→</view>
    </view>
    <view class="menu-item">
      <view class="menu-icon">📊</view>
      <view class="menu-text">成长报告</view>
      <view class="menu-arrow">→</view>
    </view>
    <view class="menu-item">
      <view class="menu-icon">⚙️</view>
      <view class="menu-text">设置</view>
      <view class="menu-arrow">→</view>
    </view>
  </view>
</view>
```

`miniprogram/pages/profile/profile.wxss`:
```css
.profile-header {
  text-align: center; padding: var(--spacing-xl) 0;
}
.avatar { font-size: 100rpx; margin-bottom: var(--spacing-md); }
.profile-name { font-size: var(--font-xl); font-weight: 700; margin-bottom: var(--spacing-xs); }
.profile-desc { font-size: var(--font-sm); color: var(--text-secondary); }

.stats-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm); margin-bottom: var(--spacing-xl);
}
.stat-card {
  background: var(--bg-card); border-radius: var(--radius-md);
  padding: var(--spacing-md); text-align: center; box-shadow: var(--shadow-card);
}
.stat-num { font-size: var(--font-xl); font-weight: 700; color: var(--color-primary); }
.stat-label { font-size: var(--font-xs); color: var(--text-hint); }

.menu-section { background: var(--bg-card); border-radius: var(--radius-md); overflow: hidden; }
.menu-item {
  display: flex; align-items: center;
  padding: var(--spacing-md); border-bottom: 1rpx solid var(--border-color);
}
.menu-item:last-child { border-bottom: none; }
.menu-icon { font-size: 36rpx; margin-right: var(--spacing-sm); }
.menu-text { flex: 1; font-size: var(--font-md); }
.menu-arrow { color: var(--text-hint); }
```

`miniprogram/pages/profile/profile.js`:
```javascript
const api = require('../../utils/api');

Page({
  data: {
    stats: { totalGenerations: 0, totalBattles: 0, totalNotes: 0 }
  },

  async onShow() {
    try {
      const [notesRes, historyRes] = await Promise.all([
        api.getNotes({ limit: 1000 }),
        api.getHistory({ limit: 1000 })
      ]);
      this.setData({
        stats: {
          totalGenerations: historyRes.records ? historyRes.records.length : 0,
          totalBattles: 0,
          totalNotes: notesRes.total || 0
        }
      });
    } catch (err) { /* 保持默认 0 */ }
  },

  onViewNotes() {
    wx.navigateTo({ url: '/pages/notes/notes' });
  }
});
```

- [ ] **Step 4: Commit**

```bash
git add miniprogram/pages/training/ miniprogram/pages/notes/ miniprogram/pages/profile/
git commit -m "feat: add training, notes, and profile pages"
```

---

## Self-Review

### Spec Coverage
| Spec Requirement | Implementation |
|---|---|
| 三Tab架构（场景广场/训练场/我的） | Task 8 (square), Task 13 (training + profile) |
| 场景卡片 + 搜索 | Task 8 (square page + search bar) |
| 双输入框生成页 | Task 9 (generate page) |
| 多风格表达切换 | Task 10 (result page) + Task 11 (style-tabs component) |
| 保真度溯源（来源标记） | Task 10 (analysis section: userSource/aiSupplement) |
| 技巧拆解 | Task 10 (technique block) |
| 对话链预测 | Task 10 (counterPredictions) |
| 模拟对战（多轮+不迎合AI） | Task 12 (battle page) + Task 2 (battlePrompt with 强硬对手 persona) |
| 历史笔记（场景归类+搜索+标记） | Task 13 (notes page) + Task 5 (notes API) |
| 语音输入 | Task 9 (voice button, MVP uses system keyboard voice) |
| 暖色系主题（橙/琥珀） | Task 6 (theme.wxss: #FF7A45 palette) |
| DeepSeek API 集成 | Task 2 (ai.js + prompts.js) |
| 场景驱动入口 | Task 8 + Task 9 (scene select → generate workflow) |

### Placeholder Scan
- ✅ No TBD or TODO found in code blocks
- ✅ All steps contain actual code, not descriptions
- ✅ API endpoints have complete request/response shapes
- ✅ Error handling included in all routes and page JS
- ⚠️ Tab icons need placeholder images (Task 6 Step 8 notes this explicitly)
- ⚠️ Voice input uses system keyboard in MVP (noted in code comments)

### Type Consistency
- ✅ `style` values (logical/humorous/rhetorical/empathic) consistent across prompts.js, generate route, style-tabs component
- ✅ Note object shape (id, scene, expression, technique, etc.) consistent between routes/notes.js and pages/notes/notes.js
- ✅ Component property names match between .js definitions and .wxml bindings
- ✅ `battleId` used consistently in battle flow (start → turn → end)
- ✅ API response field names match what frontend destructures

### Known MVP Trade-offs (Intentional)
- Auth middleware uses device ID instead of real WeChat OAuth
- In-memory storage (arrays) instead of database
- Result data passed via URL params (large results may need refactoring to globalData)
- Skill breakdown cards are UI-only, tap shows "即将上线" toast
- Voice input uses system keyboard, not WeChat native recorder
- Tab icons need placeholder PNG files

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-23-expression-assistant.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. 13 tasks, each committing independently.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
