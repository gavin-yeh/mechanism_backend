const { connection } = require('./database');

function load(whereClause) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
      SELECT id,
        situation_id,
        outflow_type,
        amount,
        remark
      FROM staff_situation_outflows
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

function loadById(situationId) {
  return load(`situation_id = ${situationId}`);
}

function loadByIds(situationIds) {
  if (situationIds.length === 0) {
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  }
  const situationIdList = situationIds.join(',');
  return load(`situation_id IN (${situationIdList})`);
}

function saveOrUpdate(datas) {
  return new Promise((resolve, reject) => {
    if (datas.length === 0) {
      resolve([]);
    }
    const sqlQuery = `
      INSERT INTO staff_situation_outflows
      (situation_id, outflow_type, amount, remark)
      VALUES
      ?
      ON DUPLICATE KEY UPDATE
      amount = VALUES(amount),
      remark = VALUES(remark)
    `;

    const values = datas.map((data) => [
      data.situation_id,
      data.outflow_type,
      data.amount,
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
