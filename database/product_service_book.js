const { connection } = require('./database');

function load(whereClause) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
            SELECT id, service_id, book_id
            FROM product_service_book
            WHERE ${whereClause}
        `;

        connection.query(sqlQuery, (error, results, fields) => {
            if (error) reject(error);

            // 返回查询结果
            resolve(results);
        });
    });
}

function loadByServiceIds(serviceIds) {
    if (serviceIds.length === 0) {
        return new Promise((resolve, reject) => {
            resolve([])
        })
    }
    const serviceIdList = serviceIds.join(',');
    return load(`service_id IN (${serviceIdList})`);
}


module.exports = {
    loadByServiceIds,
};
