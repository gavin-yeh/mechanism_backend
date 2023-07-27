const { connection } = require('./database');


function load(whereClause, limitClause) {
  return new Promise((resolve, reject) => {
  var sqlQuery = `
  SELECT
      public.id,
      users.name,
      users.nickname,
      users.phone,
      public.created_at,
      public.updated_at
  FROM public
  LEFT JOIN users ON public.user_id = users.id
  WHERE ${whereClause}
  ORDER BY updated_at DESC`

  if (limitClause) {
    sqlQuery += ` ` + limitClause
  }

  connection.query(sqlQuery, (error, results, fields) => {
    if (error) reject(error)

    if (results.length === 0) {
      resolve([])
      return
    }
    results = results.map(row => {
      return {
        ...row,
        created_at: row.created_at.getTime(),
        updated_at: row.updated_at.getTime(),
      }
    })

    resolve(results)
    })
  })
}

function countTotal(whereClause) {
  return new Promise((resolve, reject) => {
    var sqlQuery = `
      SELECT
        COUNT(*) AS total
      FROM public
      LEFT JOIN users ON public.user_id = users.id
      WHERE ${whereClause}`;

    connection.query(sqlQuery, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0].total);
      }
    });
  });
}

function loadById(publicId) {
  return new Promise((resolve, reject) => {
    load(`public.id = ${publicId}`)
      .then(results => resolve(results[0]))
      .catch(error => reject(error))
  })
}

function loadByIds(publicIds) {
    const publicIdList = publicIds.join(',')
    return load(`public.id IN (${publicIdList})`)
}

async function loadByPage(currentPage, pageSize, filterText) {
  var whereClause = `1 = 1`
  if (filterText) {
    whereClause = `users.name LIKE '%${filterText}%' or users.phone LIKE '%${filterText}%'`
  }

  const offset = (currentPage - 1) * pageSize
  const count = pageSize
  const limitClause = `LIMIT ${offset}, ${count}`

  const query1 = load(whereClause, limitClause)
  const query2 = countTotal(whereClause)
  const [profiles, totalCount] = await Promise.all([query1, query2])

  return new Promise((resolve, reject) => {
    resolve({ profiles, totalCount })
  })
}

function loadAll() {
    return load(`1 = 1`)
}

function insert(userId, fsmId, createdAt) {
  return new Promise((resolve, reject) => {
    var sqlQuery = `
    INSERT INTO public
      (user_id,
      fsm_id,
      created_at,
      updated_at)
    VALUES
      (${userId},
      ${fsmId},
      FROM_UNIXTIME(${createdAt / 1000}),
      FROM_UNIXTIME(${createdAt / 1000}))
      ;`

    connection.query(sqlQuery, (error, results, fields) => {
      if (error) {
        reject(error)
        return
      }

      const publicId = results.insertId
      resolve(publicId)
    })
  })
}

module.exports = {
    loadById,
    loadByIds,
    loadByPage,
    loadAll,
    insert,
}
