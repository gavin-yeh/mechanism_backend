
const response = require('./generic/response.js')
const db_productService = require('./../database/product_service.js')
const db_productServiceBook = require('./../database/product_service_book.js')


async function searchHandler(req, res) {
  const filterName = req.query.filter_name


  const query1 = db_productService.searchByName(filterName)
  const [productServices] = await Promise.all([query1])

  const serviceIds = productServices.map(obj => obj.service_id);
  const query2 = db_productServiceBook.loadByServiceIds(serviceIds)
  const [productServiceBooks] = await Promise.all([query2])

  const productServiceDatas = productServices.map(row => {
    const books = productServiceBooks.filter(obj => obj.service_id === row.service_id)
    return {
      ...row,
      value: row.product_name,
      books,
    }
  })

  const result = { productServiceDatas }
  response.sendSuccess(req, res, result)
}


module.exports = {
  searchHandler,
}
