const http = require('http')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// 模拟个数据库操作
const {
  findUserByEmail
} = require('./database');

// 声明一个签名
const signatrue = 'jerry_shi@20180730'

// 为request对象添加 “耳朵” 和 “手”
// 当听到有data来敲门时就拿手去累加
// 当听到数据end传完了就用手resolve返回
let readBody = request => {
  // 不喜欢语法糖 我加return了
  return new Promise(resolve => {
    let body = ''
    request.on('data', chunk => {
      // some buffer
      body += chunk.toString()
    })
    request.on('end', () => {
      resolve(body)
    })
  })
}

// 为每个用户生成不同token
let createToken = user => {
  return jwt.sign(
    { userId: user.id },  // payload (以后可以根据token拿到捣乱者的身份信息)
    signatrue,            // secretOrPrivateKey
     { expiresIn: '2h' }  // options
  )
}

// POST /tokens
let postTokens = async (req, res) => {
  // [函数式编程]解析post的body值
  let body = await readBody(req)

  let creds = JSON.parse(body)
  let { email, password } = creds
  let user = findUserByEmail(email)
  
  // 逆不了作者原来的密码，只能自己生成一个，然后存 “数据库 ”了
  // const hash = await bcrypt.hash('jerry', 10)
  // console.log(hash)
  
  // 异步比较密码
  let isValid = await bcrypt.compare(password, user.password)
  if (isValid) {
    // 返回授权token
    let token = createToken(user)
    res.end(token)
  } else {
    res.end('No token for you!')
  }
}

// GET /private
let privatePage = (req, res) => {
  // 从header里结构authorization并命名token
  let { authorization: token } = req.headers
  let payload

  // 如果jwt失效，就会抛异常
  try {
    payload = jwt.verify(token, signatrue)
  } catch (err) {
    throw new Error(err)
  }

  if (payload) {
    let { userId } = payload
    res.end(`Muahaha welcome to the club, user #${userId}`)
  } else {
    res.end('YOU SHALL NOT PASS')
  }
}

// GET /
let defaultPage = (req, res) => {
  res.end('hello world\n' + req.method +'\n' + req.url)
}

// 路由配置
let routers = {
  'POST /tokens': postTokens,
  'GET /private': privatePage,
  'GET /': defaultPage
}

let server = http.createServer((req, res) => {
  let {url, method} = req
  // 配置路由key值
  let route = `${method} ${url}`
  // 匹配路由
  routers[route](req, res)
})

server.listen(3001)

// curl -d '{"email":"szy0syz@gmail.com", "password":"jerry"}' -H "Content-Type: application/json" -X POST http://localhost:3001/tokens
// curl http://localhost:3001/private -H "authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTUzMjk1Nzg2MiwiZXhwIjoxNTMyOTY1MDYyfQ.Dn9gOxUSp5h9GJ_4cURwMGYasITojqA1arE9dZk-Nbc"