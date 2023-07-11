
const response = require('./generic/response.js')
const utils = require('./weekly_product_report_utils.js')
const situationProfiles = require('./../database/staff_situation_profiles.js')
const situationCurves = require('./../database/staff_situation_curves.js')
const situationItems = require('./../database/staff_situation_items.js')
const situationStudies = require('./../database/staff_situation_studies.js')
const situationPoints = require('./../database/staff_situation_points.js')
const staffs = require('./../database/staffs.js')
const timer = require('../src/timer/timer.js')
const lineNotify = require('../src/third/line_notify.js')
const appScript = require('../src/third/app_script.js')


async function userInfoHandler(req, res) {
  const staffId = req.userInfo.staffId
  const dateString = req.query.date

  // 取得日期(週四)的資訊
  const thursdayInfo = timer.getThursdayInfo(dateString)

  // 撈取DB
  const query1 = situationProfiles.loadByIdAndDate(staffId, thursdayInfo.thursday)
  const query2 = situationCurves.loadById(staffId)
  const query3 = staffs.loadById(staffId)

  const [porfile, curves, staff] = await Promise.all([query1, query2, query3])

  // 檢查是否已經輸入過
  var alreadyWrote = false
  if (porfile) {
    alreadyWrote = true
  }

  const result = {
    thursday: thursdayInfo.thursday,
    thursdayList : thursdayInfo.thursdayList,
    staffName: staff.name,
    position: staff.position,
    curves,
    alreadyWrote: alreadyWrote,
  }

  response.sendSuccess(req, res, result)
}

async function userSubmitHandler(req, res) {
  const staffId = req.userInfo.staffId
  const submitData = req.body

  // load
  const query1 = staffs.loadById(staffId)
  const query2 = situationCurves.loadById(staffId)
  const [staff, curves] = await Promise.all([query1, query2])


  // put situations porfile
  const sp = utils.transformSituationProfile(staff, submitData)
  const put1 = situationProfiles.saveOrUpdateOne(sp)
  const [situationId] = await Promise.all([put1])


  // put situations & studies
  const sis = utils.transformSituationItems(situationId, submitData.mainCurve, submitData.subCurve, curves)
  const sss = utils.transformSituationStudies(situationId, submitData.studyHours)
  const put2 = situationItems.saveOrUpdate(sis)
  const put3 = situationStudies.saveOrUpdate(sss)
  await Promise.all([put2, put3])


  // 計算上次四周日期
  const preThursday = timer.previousThursday(submitData.date)

  // 找尋上次曲線
  const query3 = situationProfiles.loadByIdAndDate(staffId, preThursday)
  const [preProfile] = await Promise.all([query3])

  var preItems = []
  if (preProfile) {
    const query4 = situationItems.loadById(preProfile.id)
    const [items] = await Promise.all([query4])
    preItems = items
  }

  // 創建 line 訊息
  const lineMessage = utils.createLineMessage(staff, submitData.date, submitData.mainCurve, preItems)
  lineNotify.send(lineMessage)

  // 創建 google doc 文件檔
  const appScriptResp = await appScript.call("generateWeeklyProductReport", submitData)

  const url = appScriptResp.data.url
  const result = { url }
  response.sendSuccess(req, res, result)
}


async function infoHandler(req, res) {
  const staffId = req.query.staffId
  const dateString = req.query.date

  // load 1
  const query1 = staffs.loadById(staffId)
  const query2 = situationProfiles.loadByIdAndDate(staffId, dateString)
  const [staff, profile] = await Promise.all([query1, query2])

  // load 2
  const query3 = situationItems.loadById(profile.id)
  const query4 = situationStudies.loadById(profile.id)
  const [items, studies] = await Promise.all([query3, query4])


  const result = { staff, profile, items, studies }
  response.sendSuccess(req, res, result)
}

async function submitHandler(req, res) {
  const { staffId, submitData } = req.body

  // load
  const query1 = staffs.loadById(staffId)
  const query2 = situationCurves.loadById(staffId)
  const [staff, curves] = await Promise.all([query1, query2])


  // put situations porfile
  const sp = utils.transformSituationProfile(staff, submitData)
  const put1 = situationProfiles.saveOrUpdateOne(sp)
  const [situationId] = await Promise.all([put1])


  // put situations & studies
  const sis = utils.transformSituationItems(situationId, submitData.mainCurve, submitData.subCurve, curves)
  const sss = utils.transformSituationStudies(situationId, submitData.studyHours)
  const put2 = situationItems.saveOrUpdate(sis)
  const put3 = situationStudies.saveOrUpdate(sss)
  await Promise.all([put2, put3])


  // delete point
  situationPoints.deleteById(situationId)

  const result = {}
  response.sendSuccess(req, res, result)
}



module.exports = {
  infoHandler,
  submitHandler,
  userInfoHandler,
  userSubmitHandler,
}

