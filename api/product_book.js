
const response = require('./generic/response.js')
const db_productBook = require('./../database/product_book.js')


async function searchHandler(req, res) {
  const filterName = req.query.filter_name


  const query1 = db_productBook.searchByName(filterName)
  const [productBooks] = await Promise.all([query1])


  const result = { productBooks }
  response.sendSuccess(req, res, result)
}

async function listHandler(req, res) {
  const bookIds = req.query.book_ids

  const query1 = db_productBook.loadByIds(bookIds)
  const [productBooks] = await Promise.all([query1])

  
  const result = { productBooks }
  response.sendSuccess(req, res, result)
}


module.exports = {
  searchHandler,
  listHandler,
}
