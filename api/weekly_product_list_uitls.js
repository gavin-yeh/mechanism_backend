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

function transformSituationPoints(profiles, rows) {
  const pointTypes = [
    { key: 'points_base', column: 'basicPoints' },
    { key: 'points_technical_training_plus', column: 'technicalTraining' },
    { key: 'points_management_training_plus', column: 'managementTraining' },
    { key: 'points_audit_case_plus', column: 'caseAnalysis' },
    { key: 'points_seniority_plus', column: 'seniority' },
    { key: 'points_job_status', column: 'positionStatus' },
    { key: 'points_working_hours', column: 'workHours' },
    { key: 'points_study_hours', column: 'studyHours' },
    { key: 'points_writing_letters', column: 'letter' },
    { key: 'points_attending_staff', column: 'attendStaffMeeting' },
    { key: 'points_non_submission', column: 'unsubmittedStatus' },
    { key: 'points_gi', column: 'GI' },
    { key: 'points_gbs', column: 'GBS' },
    { key: 'points_total', column: 'totalPoints' }
  ];

  return rows.flatMap(row => {
    const profile = profiles.find(p => p.id === row.situation_id);
    if (!profile) return [];

    return pointTypes.map(type => ({
      situation_id: row.situation_id,
      points_type: type.key,
      points: row[type.column],
      remark: row.note
    }));
  });
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
  transformSituationProfiles,
  transformSituationPoints,
  transformOutputPoints,
};

