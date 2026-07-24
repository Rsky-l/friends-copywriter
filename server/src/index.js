require('dotenv').config();
const express = require('express');
const cors = require('cors');

const generateRouter = require('./routes/generate');
const battleRouter = require('./routes/battle');
const notesRouter = require('./routes/notes');
const scenesRouter = require('./routes/scenes');
const skillRouter = require('./routes/skill');
const growthRouter = require('./routes/growth');
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
app.use('/api/skill', authMiddleware, skillRouter);
app.use('/api/growth', authMiddleware, growthRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: '内部服务器错误' });
});

app.listen(PORT, () => {
  console.log(`表达助手服务已启动: http://localhost:${PORT}`);
});
