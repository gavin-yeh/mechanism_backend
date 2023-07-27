const { connection } = require('./database');


function insert(name, nickname, phone, create_at) {
  return new Promise((resolve, reject) => {
    var sqlQuery = `
    INSERT INTO users
      (name,
      nickname,
      phone,
      create_at)
      VALUES
      ('${name}',
      '${nickname}',
      '${phone}',
      FROM_UNIXTIME(${create_at / 1000}))
      ;`

    connection.query(sqlQuery, (error, results, fields) => {
      if (error) {
        reject(error)
        return
      }

      const userId = results.insertId
      resolve(userId)
    })
  })
}
  
module.exports = {
    insert,
}
