// 微信小程序登录态校验中间件
// MVP 阶段：从请求头读取 openid 或 token，做基础校验
// 后续可接入微信 code2session 接口做正式校验

function authMiddleware(req, res, next) {
  let openid = req.headers['x-user-openid'];

  // 从 Authorization 头提取 token，去除 "Bearer " 前缀
  if (!openid && req.headers['authorization']) {
    const authHeader = req.headers['authorization'];
    openid = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  }

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
