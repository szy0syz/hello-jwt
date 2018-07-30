const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// 模拟个数据库操作
const {
  findUserByEmail
} = require('./database');

// 声明一个签名
const signatrue = 'jerry_shi@20180730'

let createToken = user => {
  return jwt.sign(
    { userId: user.id },
    signatrue,
    { expiresIn: '1d' }
  )
}

let postTokens = async ctx => {
  let { email, password } = ctx.request.body
  let user = findUserByEmail(email)

  let isValid = await bcrypt.compare(password, user.password)
  if (isValid) {
    let token = createToken(user)
    ctx.body = token
  } else {
    ctx.body = 'No token for you!'
  }
}

let privatePage = ctx => {
  ctx.body = `Muahaha welcome to the club, user #${ctx.jwt.userId}`
}

let checkToken = async (ctx, next) => {
  let { authorization: token } = ctx.headers
  let payload
  if(!token) return (ctx.body = 'authorizaion page, must token')
  try {
    payload = jwt.verify(token, signatrue)
  } catch(err) {
    throw new Error(err)
  }

  if (payload) {
    ctx.jwt = payload
    await next()
  } else {
    ctx.body = 'YOU SHALL NOT PASS'
  }
}

const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

let app = new Koa()
let router = new Router()

let tokensAPI = new Router()
tokensAPI.post('/', postTokens)

let api = new Router()
api.get('/private', privatePage)

router.use('/tokens', tokensAPI.routes())
router.use('/api',checkToken, api.routes())

app.use(bodyParser())
app.use(router.routes())
app.listen(3002)