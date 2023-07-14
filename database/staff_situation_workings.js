const { connection } = require('./database');

function load(whereClause) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
      SELECT id,
        situation_id,
        week_day,
        working_hours,
        remark
      FROM staff_situation_workings
      WHERE ${whereClause}
      ORDER BY id
    `;

    connection.query(sqlQuery, (error, results, fields) => {
      if (error) reject(error);

      // 返回查询结果
      resolve(results);
    });
  });
}

function loadById(profileId) {
  return load(`situation_id = ${profileId}`);
}

function loadByIds(profileIds) {
  if (profileIds.length === 0) {
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  }
  const profileIdList = profileIds.join(',');
  return load(`situation_id IN (${profileIdList})`);
}

function saveOrUpdate(datas) {
  return new Promise((resolve, reject) => {
    if (datas.length === 0) {
      resolve([]);
    }
    const sqlQuery = `
      INSERT INTO staff_situation_workings
      (situation_id, week_day, working_hours, remark)
      VALUES
      ?
      ON DUPLICATE KEY UPDATE
      working_hours = VALUES(working_hours),
      remark = VALUES(remark)
    `;

    const values = datas.map((data) => [
      data.situation_id,
      data.week_day,
      data.working_hours,
      data.remark,
    ]);

    connection.query(sqlQuery, [values], (error, results) => {
      if (error) reject(error);

      // 返回查询结果
      resolve(results);
    });
  });
}

module.exports = {
  loadById,
  loadByIds,
  saveOrUpdate,
};
