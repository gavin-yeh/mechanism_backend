// TODO: 前後端共用

const studyItems = [
  { key: 1, value: 'class' },
  { key: 2, value: 'correspondence' },
  { key: 3, value: 'analysis' },
  { key: 4, value: 'character_plan' }
]

const pointsConditionSettingMap = new Map([
  ['non-existence', -2],
  ['danger', -1],
  ['emergency', -0.5],
  ['normal operation', 0],
  ['normal operation plus', 1],
  ['affluence', 2]
])
  
const employmentSettingMap = new Map([
  ['full_time', { hours: 40, name: '全職' }],
  ['half_time', { hours: 20, name: '半職' }]
])

module.exports = {
  studyItems,
  pointsConditionSettingMap,
  employmentSettingMap,
};
