const jwt = require('jsonwebtoken')

module.exports = function (name) {
  return jwt.sign({name: name}, 'secret', {expiresIn: '10s'})
}
