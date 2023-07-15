const { connection } = require('./database');


function load(whereClause) {
  return new Promise((resolve, reject) => {
  const sqlQuery = `
  SELECT
      users.id,
      users.name,
      staffs.id,
      staffs.user_id,
      staffs.employment_type,
      staffs.position,
      staffs.department,
      staffs.points_base,
      staffs.points_technical_training_plus,
      staffs.points_management_training_plus,
      staffs.points_audit_case_plus,
      staffs.points_seniority_plus,
      staffs.roles
  FROM staffs
  LEFT JOIN users ON staffs.user_id = users.id
  WHERE ${whereClause}
  ORDER BY FIELD(department, 'div7', 'div1', 'div2', 'div3', 'div4', 'div5', 'div6A', 'div6B', 'div6C'), staff_order`

  connection.query(sqlQuery, (error, results, fields) => {
          if (error) reject(error)

          resolve(results)
      })
  })
}

function loadById(staffId) {
  return new Promise((resolve, reject) => {
    load(`staffs.id = ${staffId}`)
      .then(results => resolve(results[0]))
      .catch(error => reject(error))
  })
}

function loadByIds(staffIds) {
    const staffIdList = staffIds.join(',')
    return load(`staffs.id IN (${staffIdList})`)
}

function loadAll() {
    return load(`1 = 1`)
}

function verify(username, password) {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
    SELECT
        id,
        user_id,
        employment_type,
        position,
        department,
        points_base,
        points_technical_training_plus,
        points_management_training_plus,
        points_audit_case_plus,
        points_seniority_plus
    FROM staffs
    WHERE username = '${username}' AND password = '${password}'
    `;

    connection.query(sqlQuery, (error, results, fields) => {
      if (error) reject(error)

      if (results.length == 0) {
          resolve(null)
      }

      const staff = results[0]
      resolve(staff)
    })
  })
}

module.exports = {
    loadById,
    loadByIds,
    loadAll,
    verify,
}
