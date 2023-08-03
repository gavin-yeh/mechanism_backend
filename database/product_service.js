const { connection } = require('./database');


function load(whereClause, limitClause) {
  return new Promise((resolve, reject) => {
  var sqlQuery = `
  SELECT
      product.id,
	  product.category,
	  product.product_type,
	  product.product_name,
	  product.english_name,
	  product.remark,
	  product_service.id as service_id,
	  product_service.price
  FROM product
  JOIN product_service on product.id = product_service.product_id
  WHERE ${whereClause}`

  if (limitClause) {
    sqlQuery += ` ` + limitClause
  }

  connection.query(sqlQuery, (error, results, fields) => {
          if (error) reject(error)

          resolve(results)
      })
  })
}

function loadById(serviceId) {
  return new Promise((resolve, reject) => {
    load(`product_book.id = ${serviceId}`)
      .then(results => resolve(results[0]))
      .catch(error => reject(error))
  })
}

function loadByIds(serviceIds) {
    const serviceIdList = serviceIds.join(',')
    return load(`product_book.id IN (${serviceIdList})`)
}

function searchByName(filterName) {
    const count = 8
    const whereClause = `product.product_name LIKE '%${filterName}%'`
    const limitClause = `LIMIT 0, ${count}`
    return load(whereClause, limitClause)
}

function loadAll() {
    return load(`1 = 1`)
}


module.exports = {
    loadById,
    loadByIds,
    loadAll,
    searchByName,
}
