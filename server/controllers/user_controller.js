const sha1 = require('sha1')
const express = require('express')
const router = express.Router()
const User = require('../model/user')
const moment = require('moment')
const objectIdToTimeStamp = require('objectid-to-timestamp')
const createToken = require('../moddleware/create_token')
const checkToken = require('../moddleware/check_token')

const userRegister = (req, res, next) => {
  let user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    recheck: req.body.recheck,
    token: createToken(req.body.email)
  })
  user.create_at = moment(objectIdToTimeStamp(user._id)).format('YYYY-MM-DD HH:mm:ss')
  User.findById({ _id: user._id })
      .then(user => {
        if (user) {
          res.json({info: '用户已存在!'})
          next()
        } else {
          user.save(err => {
            if (err) {
              console.log(err)
            }
            res.json({success: '注册成功!'})
            next()
          })
        }
      })
      .catch(err => console.log(err))
}
// 用户登录
const userLogin = () => {}
// 获取全部用户
const getAllUser = () => {}
// 删除一个用户
const removeUser = () => {}

module.exports = (router) => {
  router.get('/allUser', getAllUser)
  router.post('/userRegister', userRegister)
  router.post('/userLogin', userLogin)
  router.post('/removeUser', removeUser)
}
