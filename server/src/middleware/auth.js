const authMiddleware = (req, res, next) => {
  req.userId = req.headers['x-device-id'] || 'anonymous';
  next();
};

module.exports = { authMiddleware };
