
const response = require('./generic/response.js')
const public = require('../database/public.js')

async function registerHandler(req, res) {
  const { submitData } = req.body


  const query1 = user.insert(full_name, nickname, phone, ts)
  const [userId] = await Promise.all([query1])


  response.sendSuccess(req, res, { publicId })
}

module.exports = {
    registerHandler,
  };
  