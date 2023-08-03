const { connection } = require('./database');


function load(whereClause) {
    return new Promise((resolve, reject) => {
    const sqlQuery = `
    SELECT 
      id,
      public_product_id,
      public_action_id,
      public_register_series_id,
      created_at,
      receipt_number,
      payment_method,
      payment_amount
    FROM public_register
    WHERE ${whereClause}
    `;

    connection.query(sqlQuery, (error, results, fields) => {
            if (error) reject(error);

            // 返回查询结果
            resolve(results);
        });
    });
}

function loadById(id) {
    return load(`id = '${id}'`)
}


function save(datas) {
  return new Promise((resolve, reject) => {
    if (datas.length === 0) {
        resolve([])
    }
    const sqlQuery = `
    INSERT INTO public_register
    (public_product_id, public_action_id, public_register_series_id, created_at, receipt_number, payment_method, payment_amount)
    VALUES
    ?
    `;

    const values = datas.map(data => [
        data.public_product_id,
        data.public_action_id,
        data.public_register_series_id,
        data.created_at,
        data.receipt_number,
        data.payment_method,
        data.payment_amount,
    ])

    connection.query(sqlQuery, [values], (error, results) => {
      if (error) reject(error);

      // 返回查询结果
      resolve(results.insertId)
    });
  });
}

module.exports = {
    loadById,
    save,
};