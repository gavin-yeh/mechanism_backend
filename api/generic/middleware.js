const cors = require('cors');
const bodyParser = require('body-parser');

const response = require('./response.js')
const tokener = require('../../src/tokener/jwt.js')


function errorHandler(req, res, next) {
  try {
    next()
  } catch (error) {
    console.error(error);
    response.handleError(req, res)
  }
}

// 添加CORS中间件
function corsHandler(req, res, next) {
  cors({
    origin: process.env.HEADER_ORIGIN,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-token'] // 添加允许的请求头字段
  })(req, res, next)
}

// http body中間件
function parseJSONHandler(req, res, next) {
  bodyParser.json()(req, res, next)
}

// 通用中間件
function genericHandler(req, res, next) {
  console.log('api: ', req.method, req.path)
  next()
}

// 登入中間件
function loginHandler(req, res, next) {
  verifyToken(req, res, next)
}

// JWT驗證中間件
function verifyToken(req, res, next) {
  // 從請求標頭中獲取JWT
  const token = req.headers['x-token'];

  // 驗證 token type
  if (typeof token === 'undefined') {
    response.sendFail(req, res, '帳號未登入，請重新登入', 'Missing token')
    return
  }

  // verify
  tokener.verify(token, (err, userInfo) => {
    if (err) {
      response.sendFail(req, res, '無效的憑證，請重新登入', 'Invalid token')
      return
    }
  
    req.userInfo = userInfo;
    next()
  })
}

module.exports = {
  errorHandler,
  corsHandler,
  parseJSONHandler,
  genericHandler,
  loginHandler,
};
