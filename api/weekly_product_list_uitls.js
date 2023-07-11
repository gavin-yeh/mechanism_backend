const { pointsConditionSettingMap, employmentSettingMap } = require('./define.js')

function transformRows(thursday, staffList, profiles, points, items, studies) {
  var rows = []
  staffList.forEach(staff => {
    const profile = profiles.find(p => p.staff_id === staff.id)
    const point = points.find(p => p.situation_id === (profile) ? profile.id : -1)
    const itemList = items.find(p => p.situation_id === (profile) ? profile.id : -1)
    const studyList = studies.find(p => p.situation_id === (profile) ? profile.id : -1)
  
    var row = {
      date:                  thursday,
      staffId:               staff.id,
      situationId:           (profile) ? profile.id : 0,
      name:                  staff.name,
      position:              staff.position,
      staffType:             staff.employment_type,
      isButtonDisabled:      (profile) ? true : false,
      totalStatus:           (profile) ? profile.general_condition : 0,
      individualStatus:      (profile) ? profile.personal_condition : 0,
      formulaStatus:         (profile) ? profile.finish_condition_formula : 0,
      staffMeeting:          (profile) ? profile.attend_meeting : 0,
      comment:               (profile) ? profile.annotation : '',
      basicPoints:           (point) ? point.points_base : staff.points_base,
      technicalTraining:     (point) ? point.points_technical_training_plus : staff.points_technical_training_plus,
      managementTraining:    (point) ? point.points_management_training_plus : staff.points_management_training_plus,
      caseAnalysis:          (point) ? point.points_audit_case_plus : staff.points_audit_case_plus,
      seniority:             (point) ? point.points_seniority_plus : staff.points_seniority_plus,
      positionStatus:        (point) ? point.points_job_status : calculateTotalConditionPoints(profile),
      workHours:             (point) ? point.points_working_hours : calculateWorkPoints(staff, profile),
      studyHours:            (point) ? point.points_study_hours : calculateStudiesPoints(staff, studyList),
      letter:                (point) ? point.points_writing_letters : calculateOutflowPoints(staff, profile),
      unsubmittedStatus:     (point) ? point.points_attending_staff : calculateAttendingStaffPoints(staff, profile),
      attendStaffMeeting:    (point) ? point.points_non_submission : calculateNonSubmissionPoints(staff, profile),
      GI:                    (point) ? point.points_gi : 0,
      GBS:                   (point) ? point.points_gbs : 0,
      totalPoints:           (point) ? point.points_total : 0,
      note:                  (point) ? point.remark : ''
    }

    if (!point) {
        row.totalPoints = calculateTotalPoints(row)
    }

    rows.push(row)
  })

  return rows
}

// 週總狀況
function calculateTotalConditionPoints(profile) {
  if (!profile) {
    return 0
  }
  const point = pointsConditionSettingMap.get(profile.general_condition)
  if (point) {
    return point
  }
  return 0
}

// 工作時數
function calculateWorkPoints(staff, profile) {
  if (!profile) {
    return 0
  }

  const workHours = 
      Number(profile.working_hours_w1)
    + Number(profile.working_hours_w2)
    + Number(profile.working_hours_w3)
    + Number(profile.working_hours_w4)
    + Number(profile.working_hours_w5)
    + Number(profile.working_hours_w6)
    + Number(profile.working_hours_w7)

  const prescribedHours = employmentSettingMap.get(staff.employment_type).hours
  var points = 0
  if (workHours < prescribedHours) {
      const wh = -(prescribedHours - workHours) * 10000 / prescribedHours
      points = wh * Number(staff.points_base)
      points /= 10000
  }
  return points
}

// 讀書時數
function calculateStudiesPoints(staff, studies) {
  if (!studies) {
    return 0
  }

  var points = 0
  var studyHours = 0
  for (i = 0; i < studies.length; i++) {
    studyHours += studies[i].hours
  }
  if (studyHours == 0) {
    points = employmentPoints(staff, -1)
  }
  return points
}


// 寫信
function calculateOutflowPoints(staff, profile) {
  if (!profile) {
    return 0
  }

  if (profile.outflow_promote == 0 && profile.outflow_line == 0) {
    return employmentPoints(staff, -1)
  }
  return 0
}

// 職員會議
function calculateAttendingStaffPoints(staff, profile) {
  if (!profile) {
    return 0
  }

  if (profile.attend_meeting === 'no') {
    return employmentPoints(staff, -1)
  }
  return 0
}

// 未交狀況公式
function calculateNonSubmissionPoints(staff, profile) {
  if (!profile) {
    return 0
  }

  if (profile.finish_condition_formula === 'no') {
    return employmentPoints(staff, -1)
  }
  return 0
}


function employmentPoints(staff, value) {
  value = Number(value)
  if (staff.employment_type === 'half_time') {
  return value / 2
  }
  return value
}

function calculateTotalPoints(item) {
  var points =
    10000 * Number(item.basicPoints) +
    10000 * Number(item.technicalTraining) +
    10000 * Number(item.managementTraining) +
    10000 * Number(item.caseAnalysis) +
    10000 * Number(item.seniority) +
    10000 * Number(item.positionStatus) +
    10000 * Number(item.workHours) +
    10000 * Number(item.studyHours) +
    10000 * Number(item.letter) +
    10000 * Number(item.unsubmittedStatus) +
    10000 * Number(item.attendStaffMeeting) +
    10000 * Number(item.GI) +
    10000 * Number(item.GBS)

  points = points / 10000
  if (points > 0) {
    return points
  }
  return 0
}

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

function transformSituationPoints(profiles, rows) {
  return rows.map(row => {
    let profile = profiles.find(p => p.id === row.situationId)

    if(!profile) return null

    return {
      situation_id: row.situationId,
      points_base: row.basicPoints,
      points_technical_training_plus: row.technicalTraining,
      points_management_training_plus: row.managementTraining,
      points_audit_case_plus: row.caseAnalysis,
      points_seniority_plus: row.seniority,
      points_job_status: row.positionStatus,
      points_working_hours: row.workHours,
      points_study_hours: row.studyHours,
      points_writing_letters: row.letter,
      points_attending_staff: row.attendStaffMeeting,
      points_non_submission: row.unsubmittedStatus,
      points_gi: row.GI,
      points_gbs: row.GBS,
      points_total: row.totalPoints,
      remark: row.note
    }
  }).filter(point => point !== null)
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
      row.basicPoints,
      row.attendStaffMeeting,
      row.GI,
      row.GBS,
      row.letter,
      row.studyHours,
      row.unsubmittedStatus,
      row.workHours,
      row.positionStatus,
      row.technicalTraining,
      row.managementTraining,
      row.caseAnalysis,
      row.seniority,
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
  transformRows,
  transformSituationProfiles,
  transformSituationPoints,
  transformOutputPoints,
};

