const { connection } = require('./database');

function load(whereClause) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
            SELECT id,
              situation_id,
              points_type,
              points,
              remark
            FROM staff_situation_points
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

function loadByIds(situationIds) {
    if (situationIds.length === 0) {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }
    const situationIdList = situationIds.join(',');
    return load(`situation_id IN (${situationIdList})`);
}

function saveOrUpdate(datas) {
    return new Promise((resolve, reject) => {
        if (datas.length === 0) {
            resolve([]);
        }
        const sqlQuery = `
            INSERT INTO staff_situation_points
            (situation_id, points_type, points, remark)
            VALUES ?
            ON DUPLICATE KEY UPDATE
            points = VALUES(points),
            remark = VALUES(remark)
        `;

        const values = datas.map(data => [
            data.situation_id,
            data.points_type,
            data.points,
            data.remark
        ]);

        connection.query(sqlQuery, [values], (error, results) => {
            if (error) reject(error);

            // return query result
            resolve(results);
        });
    });
}

function deleteById(situationId) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
            DELETE FROM staff_situation_points
            WHERE situation_id = ${situationId}
        `;

        connection.query(sqlQuery, (error, results) => {
            if (error) reject(error);

            // return query result
            resolve(results);
        });
    });
}

module.exports = {
    loadByIds,
    saveOrUpdate,
    deleteById,
};
