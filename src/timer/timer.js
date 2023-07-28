
// 星期一到日 回傳本週四
function getWeekThursday(date) {
  const day = date.getDay() // 取得星期幾（0-6，其中0代表星期日，1代表星期一，以此類推）

  if (day <= 3) {
    // 若是週日到週三，回傳未來的週四
    const daysUntilThursday = 4 - day
    date.setDate(date.getDate() + daysUntilThursday)
  } else {
    // 若是週四到週六，回傳過去的週四
    const daysSinceThursday = day - 4
    date.setDate(date.getDate() - daysSinceThursday)
  }

  return date
}

function getThursdayInfo(dateString) {
  return getThursdayList(dateString, -5, 5)
}

function getThursdayList(dateString, lowerLimit, upperLimit) {
  // 取得當前日期
  const today = new Date()
  thursday = getWeekThursday(today)

  // 取得本週週四
  if (dateString) {
    var day = new Date(dateString)
    thursday = getWeekThursday(day)
  }

  // 將日期轉換為 UTC+0
  thursday.setUTCHours(0, 0, 0, 0)

  // 取得上下範圍的週四
  var startDate = new Date(thursday)
  var endDate = new Date(thursday)

  startDate.setDate(thursday.getDate() + 7 * lowerLimit)
  endDate.setDate(thursday.getDate() + 7 * upperLimit)

  var thursdayList = []
  var currentDate = startDate
  while (currentDate < endDate) {
    currentDate.setDate(currentDate.getDate() + 7) // 每次增加七天
    thursdayList.push(currentDate.toISOString().split('T')[0])
  }

  const result = {
    thursday: thursday.toISOString().split('T')[0],
    thursdayList: thursdayList
  }
  return result
}

 // 计算上一個週四時間字串
function previousThursday(dateString) {
  const day = new Date(dateString)
  const timestamp = day.getTime();
  const sevenDaysAgoTimestamp = timestamp - (7 * 24 * 60 * 60 * 1000)
  const previousDate = new Date(sevenDaysAgoTimestamp)
  return previousDate.toISOString().split('T')[0]
}

module.exports = {
  getThursdayInfo,
  getThursdayList,
  previousThursday,
}
