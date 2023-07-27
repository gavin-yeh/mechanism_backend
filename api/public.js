
const response = require('./generic/response.js')
const public = require('../database/public.js')
const user = require('../database/user.js')

async function addHandler(req, res) {
  const { nickname, full_name, phone, fsm_id, ts } = req.body


  const query1 = user.insert(full_name, nickname, phone, ts)
  const [userId] = await Promise.all([query1])


  const query2 = public.insert(userId, fsm_id, ts)
  const [publicId] = await Promise.all([query2])


  response.sendSuccess(req, res, { publicId })
}

async function infoHandler(req, res) {
    const publicId = req.query.public_id
  
    const profile = await public.loadById(publicId)
    if (profile == null) {
      response.sendFail(req, res, '無此大眾')
      return
    }
  
    const result = {
      public_id:  profile.id,
      name:       profile.name,
      phone:      profile.phone,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    }
    response.sendSuccess(req, res, result)
  }
  
async function searchHandler(req, res) {
  const currentPage = req.query.current_page
  const pageSize = req.query.page_size
  const filterText = req.query.filter_text

  const publicPage = await public.loadByPage(currentPage, pageSize, filterText)


  var rows = []
  publicPage.profiles.forEach(function (row) {
    const profile = {
      public_id:  row.id,
      name:       row.name,
      phone:      row.phone,
      status:     '還沒做好拉',
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
    rows.push(profile)
  })
  response.sendSuccess(req, res, { rows, total_count: publicPage.totalCount })
}

module.exports = {
  infoHandler,
  addHandler,
  searchHandler,
};
