const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const logger = require('morgan')
const api = require('./routes')
const config = require('config-lite')
const compression = require('compression')

const app = express()

app.use(logger())
app.use(favicon(path.join(__dirname, 'favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(compression({ threshold: 0 }))
app.use('/api', api)

app.use((req, res, next) => {
  const err = new Error('Page Not Found')
  err.status = 404
  next(err)
})

app.listen(3000, () => {
  console.log(`app listening on port ${config.port}`)
})
