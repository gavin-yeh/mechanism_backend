const { connection } = require('./database');

function load(whereClause) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
            SELECT id,
              situation_id,
              type,
              curve_name,
              statistics_style,
              statistics_caption,
              statistics1,
              statistics2,
              statistics3,
              condition_style,
              condition_caption,
              condition1,
              condition2,
              condition3,
              tags,
              remake
            FROM staff_situation_items
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
            INSERT INTO staff_situation_items
            (situation_id, type, curve_name, statistics_style, statistics_caption, statistics1, statistics2, statistics3, condition_style, condition_caption, condition1, condition2, condition3, tags, remake)
            VALUES ?
            ON DUPLICATE KEY UPDATE
            statistics_style = VALUES(statistics_style),
            statistics_caption = VALUES(statistics_caption),
            statistics1 = VALUES(statistics1),
            statistics2 = VALUES(statistics2),
            statistics3 = VALUES(statistics3),
            condition_style = VALUES(condition_style),
            condition_caption = VALUES(condition_caption),
            condition1 = VALUES(condition1),
            condition2 = VALUES(condition2),
            condition3 = VALUES(condition3),
            tags = VALUES(tags),
            remake = VALUES(remake)
        `;

        const values = datas.map(data => [
          data.situation_id,
          data.type,
          data.curve_name,
          data.statistics_style,
          data.statistics_caption,
          data.statistics1,
          data.statistics2,
          data.statistics3,
          data.condition_style,
          data.condition_caption,
          data.condition1,
          data.condition2,
          data.condition3,
          data.tags,
          data.remake
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
