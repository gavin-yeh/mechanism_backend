const { connection } = require('./database');


function load(whereClause) {
    return new Promise((resolve, reject) => {
    const sqlQuery = `
    SELECT id,
      staff_id,
      position,
      settlement_date,
      working_hours_w4,
      working_hours_w5,
      working_hours_w6,
      working_hours_w7,
      working_hours_w1,
      working_hours_w2,
      working_hours_w3,
      outflow_letter,
      outflow_line,
      outflow_email,
      outflow_promote,
      general_condition,
      personal_condition,
      finish_condition_formula,
      attend_meeting,
      annotation
    FROM staff_situation_profiles
    WHERE ${whereClause}
    `;

    connection.query(sqlQuery, (error, results, fields) => {
            if (error) reject(error);

            // 返回查询结果
            resolve(results);
        });
    });
}

function loadByDate(settlementDate) {
    return load(`settlement_date = '${settlementDate}'`)
}

function loadByIdAndDate(staffId, settlementDate) {
  return new Promise((resolve, reject) => {
    load(`staff_id = ${staffId} AND settlement_date = '${settlementDate}'`).then((results) => {
      resolve(results[0])
    }).catch((err) => reject(err))
  })
}

function loadByIdsAndDate(staffIds, settlementDate) {
  const staffIdList = staffIds.join(',');
  return load(`staff_id IN (${staffIdList}) AND settlement_date = '${settlementDate}'`)
}

function loadByUnique(staffId, position, settlementDate) {
    return load(`staff_id = ${staffId} AND position = '${position}' AND settlement_date = '${settlementDate}'`)
}

function saveOrUpdate(datas) {
  return new Promise((resolve, reject) => {
    if (datas.length === 0) {
        resolve([])
    }
    const sqlQuery = `
    INSERT INTO staff_situation_profiles
    (staff_id, position, settlement_date, working_hours_w4, working_hours_w5, working_hours_w6, working_hours_w7, working_hours_w1, working_hours_w2, working_hours_w3, outflow_letter, outflow_line, outflow_email, outflow_promote, general_condition, personal_condition, finish_condition_formula, attend_meeting, annotation)
    VALUES
    ?
    ON DUPLICATE KEY UPDATE
    working_hours_w4 = VALUES(working_hours_w4),
    working_hours_w5 = VALUES(working_hours_w5),
    working_hours_w6 = VALUES(working_hours_w6),
    working_hours_w7 = VALUES(working_hours_w7),
    working_hours_w1 = VALUES(working_hours_w1),
    working_hours_w2 = VALUES(working_hours_w2),
    working_hours_w3 = VALUES(working_hours_w3),
    outflow_letter = VALUES(outflow_letter),
    outflow_line = VALUES(outflow_line),
    outflow_email = VALUES(outflow_email),
    outflow_promote = VALUES(outflow_promote),
    general_condition = VALUES(general_condition),
    personal_condition = VALUES(personal_condition),
    finish_condition_formula = VALUES(finish_condition_formula),
    attend_meeting = VALUES(attend_meeting),
    annotation = VALUES(annotation)
    `;

    const values = datas.map(data => [
        data.staff_id,
        data.position,
        data.settlement_date,
        data.working_hours_w4,
        data.working_hours_w5,
        data.working_hours_w6,
        data.working_hours_w7,
        data.working_hours_w1,
        data.working_hours_w2,
        data.working_hours_w3,
        data.outflow_letter,
        data.outflow_line,
        data.outflow_email,
        data.outflow_promote,
        data.general_condition,
        data.personal_condition,
        data.finish_condition_formula,
        data.attend_meeting,
        data.annotation
    ])

    connection.query(sqlQuery, [values], (error, results) => {
      if (error) reject(error);

      // 返回查询结果
      resolve(results)
    });
  });
}

function saveOrUpdateOne(data) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
    INSERT INTO staff_situation_profiles
    (staff_id, position, settlement_date, working_hours_w4, working_hours_w5, working_hours_w6, working_hours_w7, working_hours_w1, working_hours_w2, working_hours_w3, outflow_letter, outflow_line, outflow_email, outflow_promote, general_condition, personal_condition, finish_condition_formula, attend_meeting, annotation)
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    working_hours_w4 = VALUES(working_hours_w4),
    working_hours_w5 = VALUES(working_hours_w5),
    working_hours_w6 = VALUES(working_hours_w6),
    working_hours_w7 = VALUES(working_hours_w7),
    working_hours_w1 = VALUES(working_hours_w1),
    working_hours_w2 = VALUES(working_hours_w2),
    working_hours_w3 = VALUES(working_hours_w3),
    outflow_letter = VALUES(outflow_letter),
    outflow_line = VALUES(outflow_line),
    outflow_email = VALUES(outflow_email),
    outflow_promote = VALUES(outflow_promote),
    general_condition = VALUES(general_condition),
    personal_condition = VALUES(personal_condition),
    finish_condition_formula = VALUES(finish_condition_formula),
    attend_meeting = VALUES(attend_meeting),
    annotation = VALUES(annotation)
    `;

    const values = [
        data.staff_id,
        data.position,
        data.settlement_date,
        data.working_hours_w4,
        data.working_hours_w5,
        data.working_hours_w6,
        data.working_hours_w7,
        data.working_hours_w1,
        data.working_hours_w2,
        data.working_hours_w3,
        data.outflow_letter,
        data.outflow_line,
        data.outflow_email,
        data.outflow_promote,
        data.general_condition,
        data.personal_condition,
        data.finish_condition_formula,
        data.attend_meeting,
        data.annotation
    ];

    connection.query(sqlQuery, values, (error, results, fields) => {
      if (error) reject(error);

      if (results.insertId != 0) {
          const situationId = results.insertId
          resolve(situationId);
          return
      }

      loadByUnique(data.staff_id, data.position, data.settlement_date).then((results) => {
        if (results.length === 0) {
          return
        }
        const situationId = results[0].id
        resolve(situationId)
      })
      .catch((err) => {
        reject(err)
      });

    });
  });
}

module.exports = {
    loadByDate,
    loadByIdAndDate,
    loadByIdsAndDate,
    loadByUnique,
    saveOrUpdate,
    saveOrUpdateOne,
};