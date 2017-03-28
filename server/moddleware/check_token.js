const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  const token = req.headers['authorization'].split(' ')[1]
  const decoded = jwt.decode(token, 'secret')

  if (token && decoded.exp <= Date.now() / 1000) {
    return res.json({
      code: 401,
      message: 'token已过期, 请重新登录.'
    })
  }
  next()
}
