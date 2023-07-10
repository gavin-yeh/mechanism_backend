const { connection } = require('./database');

function load(whereClause) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
            SELECT id,
              situation_id,
              type,
              hours,
              study_name,
              study_progress
            FROM staff_situation_studies
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

function loadById(situationId) {
    return load(`situation_id = ${situationId}`);
}

function loadByIds(situationIds) {
    if (situationIds.length === 0) {
        return new Promise((resolve, reject) => {
            resolve([])
        })
    }
    const situationIdList = situationIds.join(',');
    return load(`situation_id IN (${situationIdList})`);
}

function saveOrUpdate(datas) {
    return new Promise((resolve, reject) => {
        if (datas.length === 0) {
            resolve([])
        }
        const sqlQuery = `
            INSERT INTO staff_situation_studies
            (situation_id, type, hours, study_name, study_progress)
            VALUES
            ?
            ON DUPLICATE KEY UPDATE
            hours = VALUES(hours),
            study_name = VALUES(study_name),
            study_progress = VALUES(study_progress)
        `;

        const values = datas.map(data => [
            data.situation_id,
            data.type,
            data.hours,
            data.study_name,
            data.study_progress
        ]);

        connection.query(sqlQuery, [values], (error, results) => {
            if (error) reject(error);

            // 返回查询结果
            resolve(results);
        });
    });
}

module.exports = {
    loadById,
    loadByIds,
    saveOrUpdate,
};
