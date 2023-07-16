
const response = require('./generic/response.js')
const utils = require('./weekly_product_list_uitls.js')
const timer = require('../src/timer/timer.js')
const staffs = require('./../database/staffs.js')
const situationProfiles = require('./../database/staff_situation_profiles.js')
const situationItems = require('./../database/staff_situation_items.js')
const situationCurves = require('./../database/staff_situation_curves.js')


async function settingHandler(req, res) {
    const { staffId } = req.query.date
  

    // load 1
    const query1 = situationCurves.loadById(staffId)
    const [curves] = await Promise.all([query1])
  
  
    const result = { curves }
    response.sendSuccess(req, res, result)
}

async function curveItemHandler(req, res) {
  const staffId = req.query.staff_id
  const dateString = req.query.date


  // load 1
  const thursday = timer.getThursdayList(dateString, -12, 0)
  const query1 = situationProfiles.loadByIdsAndDates([staffId], thursday.thursdayList)
  const query2 = situationCurves.loadById(staffId)
  const [profiles, curves] = await Promise.all([query1, query2])


  // load 2
  const situationIds = profiles.map(obj => obj.id).filter(obj => obj !== null)
  const query3 = situationItems.loadByIds(situationIds)
  const [items] = await Promise.all([query3])


  const formattedProfiles = profiles.map(row => {
    const utcDateStr = row.settlement_date
    const utcDate = new Date(utcDateStr)
    const localDate = new Date(utcDate.setHours(utcDate.getHours() + 8))

    return {
        ...row,
        settlement_date: localDate.toISOString().split('T')[0]
    }
  })

  var rows = []
  curves.forEach(curve => {

    var curveDatas = []
    thursday.thursdayList.forEach(thursday => {
      var curveData = {
        thursday:    thursday,
        statistics1: 0,
        statistics2: 0,
        statistics3: 0,
      }

      const profile = formattedProfiles.find(obj => obj.settlement_date === thursday)
      if (profile) {
        const item = items.find(obj => obj.situation_id === profile.id && obj.curve_name === curve.curve_name) 
        if (item) {
          curveData.statistics1 = Number(item.statistics1)
          curveData.statistics2 = Number(item.statistics2)
          curveData.statistics3 = Number(item.statistics3)
        }
      }

      curveDatas.push(curveData)
    })

    const row = {
      curve_name:        curve.curve_name,
      curve_type:        curve.type,
      statistics_style:  curve.statistics_style,
      tags:              curve.tags,
      show_names:         curve.show_names,
      curve_datas:       curveDatas,
    }
    rows.push(row)
  })

  const result = { rows }
  response.sendSuccess(req, res, result)
}


module.exports = {
  settingHandler,
  curveItemHandler,
}
