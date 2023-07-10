
const response = require('./generic/response.js')
const utils = require('./weekly_product_list_uitls.js')
const timer = require('../src/timer/timer.js')
const staffs = require('./../database/staffs.js')
const situationProfiles = require('./../database/staff_situation_profiles.js')
const situationItems = require('./../database/staff_situation_items.js')
const situationStudies = require('./../database/staff_situation_studies.js')
const situationPoints = require('./../database/staff_situation_points.js')
const appScript = require('../src/third/app_script.js')


async function infoHandler(req, res) {
    const dateString = req.query.date

  // 取得日期(週四)的資訊
  const thursdayInfo = timer.getThursdayInfo(dateString)


  // 撈取DB 1
  const query1 = staffs.loadAll()
  const query2 = situationProfiles.loadByDate(thursdayInfo.thursday)
  
  const [staffList, profiles] = await Promise.all([query1, query2])


  // 撈取DB 2
  const situationIds = profiles.map(profile => profile.id)

  const query3 = situationPoints.loadByIds(situationIds)
  const query4 = situationItems.loadByIds(situationIds)
  const query5 = situationStudies.loadByIds(situationIds)

  const [points, items, studies] = await Promise.all([query3, query4, query5])


  // 計算出 row
  const rows = utils.transformRows(thursdayInfo.thursday, staffList, profiles, points, items, studies)


  const result = {
    thursday: thursdayInfo.thursday,
    thursdayList : thursdayInfo.thursdayList,
    rows,
  }

  response.sendSuccess(req, res, result)
}

async function submitHandler(req, res) {
  const submitData = req.body

  // 讀取 DB
  const situationIds = submitData.rows.map(obj => obj.situationId).filter(obj => obj !== null)

  const query1 = situationProfiles.loadByDate(submitData.thursday)
  const query2 = situationItems.loadByIds(situationIds)
  
  const [profiles, items] = await Promise.all([query1, query2])

  
  // 寫入 DB
  const tsProfiles = utils.transformSituationProfiles(profiles, submitData.rows, submitData.thursday)
  const tspoints = utils.transformSituationPoints(profiles, submitData.rows)

  const query3 = situationProfiles.saveOrUpdate(tsProfiles)
  const query4 = situationPoints.saveOrUpdate(tspoints)

  const [result3, result4] = await Promise.all([query3, query4])


  // output
  var url = ''
  if (submitData.outputType === 'sheet') {
    const { pointList, auditList } = utils.transformOutputPoints(submitData.rows, items)
    const date = submitData.thursday

    const appScriptResp = await appScript.call("generateWeeklyPointsReport", { pointList, auditList, date })
    url = appScriptResp.data.url
  }


  const result = { url }
  response.sendSuccess(req, res, result)
}


module.exports = {
  infoHandler,
  submitHandler,
}
