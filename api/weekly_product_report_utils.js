const { studyItems, workingItems } = require('./define.js')

function newItem(situationId, type, curve, curveSettings) {
  const curveSetting = curveSettings.find(item => item.curve_name === curve.name)
  var item = {
    situation_id: situationId,
    type: type,
    curve_name: curve.name,
    statistics_style: curve.statistics.style,
    statistics_caption: curve.statistics.caption,
    statistics1: curve.statistics.values[0],
    statistics2: (curve.statistics.values[1] == null) ? 0 : curve.statistics.values[1],
    statistics3: (curve.statistics.values[2] == null) ? 0 : curve.statistics.values[2],
    condition_style: curve.condition.style,
    condition_caption: curve.condition.caption,
    condition1: curve.condition.values[0],
    condition2: (curve.condition.values[1] == null) ? 0 : curve.condition.values[1],
    condition3: (curve.condition.values[2] == null) ? 0 : curve.condition.values[2],
    tags: curveSetting.tags,
  }
  return item
}

function transformSituationItems(situationId, mainCurve, subCurve, curveSettings) {
  var situationItems = []
  for (const curve of mainCurve) { situationItems.push(newItem(situationId, 'main_curve', curve, curveSettings)) }
  for (const curve of subCurve) { situationItems.push(newItem(situationId, 'sub_curve', curve, curveSettings)) }

  return situationItems
}

function transformSituationStudies(situationId, studyHours) {
  var studies = []
  for (const i of studyItems) {
    var sh = studyHours[i.key]
    if (sh == null) {
      continue
    }
    var s = {
      situation_id:   situationId,
      type:           i.value,
      hours:          sh.hours,
      study_name:     sh.name,
      study_progress: sh.progress
    }
    studies.push(s)
  }

  return studies
}

function transformSituationOutflows(situationId, submitData) {
  var outflows = []
  if (submitData.flow.letter) {
    outflows.push({ situation_id: situationId, outflow_type: "letter", amount: submitData.flow.letter, remark: ''})
  }
  if (submitData.flow.letter) {
    outflows.push({ situation_id: situationId, outflow_type: "line", amount: submitData.flow.line, remark: ''})
  }
  if (submitData.flow.letter) {
    outflows.push({ situation_id: situationId, outflow_type: "email", amount: submitData.flow.email, remark: ''})
  }
  if (submitData.flow.letter) {
    outflows.push({ situation_id: situationId, outflow_type: "promote", amount: submitData.flow.promote, remark: ''})
  }
  return outflows
}

function transformSituationWorkings(situationId, submitData) {
  var workings = []
  
  Object.entries(submitData.workHours).forEach(([i, workHours]) => {
    const weekDay = workingItems.find(obj => obj.key === Number(i)).value
    workings.push({ situation_id: situationId, week_day: weekDay, working_hours: workHours, remark: ''})
  })

  return workings
}

function transformSituationProfile(staff, submitData) {
  const result = {
    staff_id: staff.id,
    position: staff.position,
    settlement_date: submitData.date,
  }

  return result
}


function createLineMessage(staff, date, mainCurve, previousCurves) {
  const newlineSymbol = `
`;
  var message = '曲線報告 ' + newlineSymbol
  message += ['日期：', date, newlineSymbol].join('');
  message += ['名字：', staff.name, , newlineSymbol].join('');
  message += ['職位：', staff.position, , newlineSymbol].join('');
  for (const curve of mainCurve) {
    var previousCaption = '沒有資料'
    if (previousCurves != null) {
      const previousCurve = previousCurves.find(item => item.curve_name === curve.name);
      if (previousCurve != null) {
        previousCaption = previousCurve.statistics_caption;
      }
    }
    if (curve.name == '') {
      continue
    }

    message += ['=======', newlineSymbol].join('');
    message += ['曲線名稱：', curve.name, newlineSymbol].join('');
    message += ['上週曲線值：', previousCaption, newlineSymbol].join('');
    message += ['本週曲線值：', curve.statistics.caption, newlineSymbol].join('');
    message += ['狀況：', curve.condition.caption, newlineSymbol].join('');
  }

  return message
}


module.exports = {
  transformSituationProfile,
  transformSituationItems,
  transformSituationStudies,
  transformSituationOutflows,
  transformSituationWorkings,
  createLineMessage,
};

