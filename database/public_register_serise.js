const { connection } = require('./database');

function load(whereClause) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
      SELECT 
        id, 
        porduct_id,
        payment_amount
      FROM public_register_serise
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

function loadById(id) {
  return load(`id = ${id}`);
}

function loadByIds(ids) {
  if (ids.length === 0) {
    return new Promise((resolve, reject) => {
      resolve([]);
    });
  }
  const idList = ids.join(',');
  return load(`porduct_id IN (${idList})`);
}

function save(data) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
      INSERT INTO public_register_serise
      (porduct_id, payment_amount)
      VALUES
      ?
    `;

    const values = [
      data.porduct_id,
      data.payment_amount,
    ];

    connection.query(sqlQuery, values, (error, results, fields) => {
      if (error) reject(error);
  
      resolve(results.insertId);
    });
  });
}

module.exports = {
  loadById,
  loadByIds,
  save,
};
