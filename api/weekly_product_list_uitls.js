const { employmentSettingMap } = require('./define.js')

function transformSituationProfiles(profiles, rows, thursday) {
  return rows.map(row => {
    let profile = profiles.find(p => p.id === row.situationId)

    if(!profile) return null

    profile.settlement_date = thursday
    profile.general_condition = row.totalStatus
    profile.personal_condition = row.individualStatus
    profile.finish_condition_formula = row.formulaStatus
    profile.attend_meeting = row.staffMeeting
    profile.annotation = row.comment
    return profile
  }).filter(profile => profile !== null)
}

function transformSituationPoints(rows) {
  const points = rows.map(obj => obj.pointDataList)

  var results = []
  points.forEach(point => {
    results = results.concat(point)
  })

  return results
}


function formatTime(h, m) {
  // 將數字轉換為兩位數的字符串
  const hours = String(h).padStart(2, '0')
  const minutes = String(m).padStart(2, '0')

  // 組合成 "hh:mm" 格式的字符串
  const formattedTime = hours + ':' + minutes
  return formattedTime
}

function transformOutputPoints(rows, items) {
  var pointList = []
  var auditList = []

  rows.forEach(function (row) {
    var data = [
      row.name,
      row.position,
      employmentSettingMap.get(row.staffType).name,
      Number(row.pointDataList.find(obj => obj.points_type === 'base').points),                     // row.basicPoints,
      Number(row.pointDataList.find(obj => obj.points_type === 'attending_staff').points),          // row.attendStaffMeeting,
      Number(row.pointDataList.find(obj => obj.points_type === 'gi').points),                       // row.GI,
      Number(row.pointDataList.find(obj => obj.points_type === 'gbs').points),                      // row.GBS,
      Number(row.pointDataList.find(obj => obj.points_type === 'writing_letters').points),          // row.letter,
      Number(row.pointDataList.find(obj => obj.points_type === 'study_hours').points),              // row.studyHours,
      Number(row.pointDataList.find(obj => obj.points_type === 'non_submission').points),           // row.unsubmittedStatus,
      Number(row.pointDataList.find(obj => obj.points_type === 'working_hours').points),            // row.workHours,
      Number(row.pointDataList.find(obj => obj.points_type === 'job_status').points),               // row.positionStatus,
      Number(row.pointDataList.find(obj => obj.points_type === 'technical_training_plus').points),  // row.technicalTraining,
      Number(row.pointDataList.find(obj => obj.points_type === 'management_training_plus').points), // row.managementTraining,
      Number(row.pointDataList.find(obj => obj.points_type === 'audit_case_plus').points),          // row.caseAnalysis,
      Number(row.pointDataList.find(obj => obj.points_type === 'seniority_plus').points),           // row.seniority,
      Number(row.pointDataList.find(obj => obj.points_type === 'special_adjustment').points),
    ]
    pointList.push(data)

    const itemList = items.filter(obj => obj.situation_id == row.situationId)
    itemList.forEach((item, index) => {
      if (!item.tags) {
        return
      }

      const tags = JSON.parse(item.tags)
      if ( tags.length === 0) {
        return
      }

      const tag = tags.find(obj => obj == "audit")
      if (!tag) {
        return
      }

      const time = formatTime(item.statistics1, item.statistics2)

      var data = [
        row.name,
        time,
      ]
      auditList.push(data)
    })
  })

  return { pointList, auditList }
}



module.exports = {
  transformSituationProfiles,
  transformSituationPoints,
  transformOutputPoints,
};

