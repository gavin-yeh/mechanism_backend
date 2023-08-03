
const response = require('./generic/response.js')
const db_staff = require('../database/staff.js')
const tokener = require('../src/tokener/jwt.js')

async function loginHandler(req, res) {
  const { username, password } = req.body;

  const staff = await db_staff.verify(username, password)
  if (staff == null) {
    response.sendFail(req, res, '帳號密碼錯誤')
    return
  }

  const token = tokener.createToken(username, staff.id)
  response.sendSuccess(req, res, { token: token})
}

async function infoHandler(req, res) {
  const staff = await db_staff.loadById(req.userInfo.staffId)
  if (staff == null) {
    response.sendFail(req, res, '職員ID不存在')
    return
  }

  const info = {
    roles: staff.roles,
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: staff.name,
    staffId: staff.id,
  }

  response.sendSuccess(req, res, info)
}

async function logoutHandler(req, res) {
  response.sendSuccess(req, res, null)
}

async function listHandler(req, res) {
  const staffs = await db_staff.loadAll()

  response.sendSuccess(req, res, { staffs })
}

module.exports = {
  loginHandler,
  infoHandler,
  logoutHandler,
  listHandler,
};
