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
	  product_book.id as book_id,
	  product_book.price,
      product_book.ias_price
  FROM product
  JOIN product_book on product.id = product_book.product_id
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

function loadById(bookId) {
  return new Promise((resolve, reject) => {
    load(`product_book.id = ${bookId}`)
      .then(results => resolve(results[0]))
      .catch(error => reject(error))
  })
}

function loadByIds(bookIds) {
  if (!bookIds || bookIds.length === 0) {
      return new Promise((resolve, reject) => {
          resolve([])
      })
  }
  const bookIdList = bookIds.join(',')
  return load(`product_book.id IN (${bookIdList})`)
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
