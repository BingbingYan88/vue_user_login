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
  user.password = sha1(user.password)
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
const userLogin = (req, res, next) => {
  let loginUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    token: createToken(req.body.email)
  })

  User.findOne({email: loginUser.email}, (err, user) => {
    if (err) {
      console.log(err)
    }
    if (!user) {
      res.json({info: '用户不存在!'})
      next()
    } else if (loginUser.password === user.password) {
      const email = req.body.email
      res.json({
        success: true,
        email: user.email,
        time: moment(objectIdToTimeStamp(user._id)).format('YYYY-MM-DD HH:mm:ss'),
        token: createToken(email)
      })
      next()
    } else {
      res.json({
        info: '密码错误!'
      })
      next()
    }
  })
}
// 获取全部用户
const getAllUser = (req, res, next) => {
  User.find({})
      .then(users => {
        res.json(users)
        next()
      })
      .catch((err) => {
        throw err
      })
}
// 删除一个用户
const removeUser = (req, res, next) => {
  User.findByIdAndRemove({_id: req.body._id})
      .then(user => {
        res.json({
          info: `${user.username} 删除成功.`
        })
      })
      .catch((err) => {
        throw err
      })
}

module.exports = (router) => {
  router.get('/allUser', getAllUser)
  router.post('/userRegister', userRegister)
  router.post('/userLogin', checkToken, userLogin)
  router.post('/removeUser', checkToken, removeUser)
}
