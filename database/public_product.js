const { connection } = require('./database');


function load(whereClause) {
    return new Promise((resolve, reject) => {
    const sqlQuery = `
    SELECT public_id, product_id, created_at, origin_price, remake
    FROM public_product
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

function loadByUnique(staffId, position, settlementDate) {
    return load(`staff_id = ${staffId} AND position = '${position}' AND settlement_date = '${settlementDate}'`)
}

function saveOrUpdateOne(data) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
    INSERT INTO public_product
    (public_id, product_id, created_at, origin_price, remake)
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    general_condition = VALUES(general_condition),
    personal_condition = VALUES(personal_condition),
    finish_condition_formula = VALUES(finish_condition_formula),
    attend_meeting = VALUES(attend_meeting),
    annotation = VALUES(annotation)
    `;

    const values = [
        data.public_id,
        data.product_id,
        data.created_at,
        data.origin_price,
        data.remake,
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
    loadByUnique,
    saveOrUpdateOne,
};