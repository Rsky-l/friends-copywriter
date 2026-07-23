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
