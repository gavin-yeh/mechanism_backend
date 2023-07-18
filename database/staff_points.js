const { connection } = require('./database');

function load(whereClause) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
            SELECT id,
              staff_id,
              date,
              points_type,
              points,
              remark
            FROM staff_points
            WHERE ${whereClause}
            ORDER BY id
        `;

        connection.query(sqlQuery, (error, results, fields) => {
            if (error) reject(error);

            const points = results.map(row => {
              const utcDateStr = row.date
              const utcDate = new Date(utcDateStr)
              const localDate = new Date(utcDate.setHours(utcDate.getHours() + 8))
          
              return {
                  ...row,
                  date: localDate.toISOString().split('T')[0]
              }
            })

            // 返回查询结果
            resolve(points);
        });
    });
}

function loadByDates(dates) {
    if (dates.length === 0) {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }
    const dateStrings = dates.map(str => `'${str}'`)
    const dateList = dateStrings.join(',')
    return load(`date IN (${dateList})`)
  }
  
function loadByIdsAndDates(staffIds, dates) {
  if (staffIds.length === 0 || dates.length === 0) {
      return new Promise((resolve, reject) => {
          resolve([]);
      });
  }
  const staffIdList = staffIds.join(',')
  const dateStrings = dates.map(str => `'${str}'`)
  const dateList = dateStrings.join(',')
  return load(`staff_id IN (${staffIdList}) AND date IN (${dateList})`)
}


function saveOrUpdate(datas) {
    return new Promise((resolve, reject) => {
        if (datas.length === 0) {
            resolve([]);
        }
        const sqlQuery = `
            INSERT INTO staff_points
            (staff_id, date, points_type, points, remark)
            VALUES ?
            ON DUPLICATE KEY UPDATE
            points = VALUES(points),
            remark = VALUES(remark)
        `;

        const values = datas.map(data => [
            data.staff_id,
            data.date,
            data.points_type,
            data.points,
            data.remark
        ]);

        connection.query(sqlQuery, [values], (error, results) => {
            if (error) reject(error);

            // return query result
            resolve(results);
        });
    });
}

function deleteByIdAndDate(staffId, date) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
            DELETE FROM staff_points
            WHERE staff_id = ${staffId} AND date = '${date}'
        `;

        connection.query(sqlQuery, (error, results) => {
            if (error) reject(error);

            // return query result
            resolve(results);
        });
    });
}

module.exports = {
    loadByDates,
    loadByIdsAndDates,
    saveOrUpdate,
    deleteByIdAndDate,
};
