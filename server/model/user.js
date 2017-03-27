const mongoose = require('mongoose')
const config = require('config-lite')

mongoose.connect(config.db)
mongoose.Promise = global.Promise

const db = mongoose.connection
db.on('error', () => {
  console.error('connect mongodb error')
})
db.on('open', () => {
  console.log('connect mongodb success')
})

const userSchema = mongoose.Schems({
  username: {type: String, required: true},
  password: {type: String, required: true},
  create_at: {type: Date, default: Date.now},
  email: String,
  recheck: String,
  token: String
})

const User = mongoose.model('User', userSchema)
module.exports = User
