const { connection } = require('./database');

function load(whereClause) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
            SELECT id,
              staff_id,
              type,
              curve_name,
              statistics_style,
              condition_style,
              \`order\`,
              tags,
              remark
            FROM staff_situation_curves
            WHERE ${whereClause}
            ORDER BY \`order\`
        `;

        connection.query(sqlQuery, (error, results, fields) => {
            if (error) reject(error);

            // 返回查询结果
            resolve(results);
        });
    });
}


function loadById(staffId) {
    return load(`staff_id = ${staffId}`);
}

function saveOrUpdate(data) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
            INSERT INTO staff_situation_curves
            (staff_id, department, position, type, curve_name, statistics_style, condition_style, \`order\`, tags, remark)
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            department = VALUES(department),
            position = VALUES(position),
            type = VALUES(type),
            curve_name = VALUES(curve_name),
            statistics_style = VALUES(statistics_style),
            condition_style = VALUES(condition_style),
            \`order\` = VALUES(\`order\`),
            tags = VALUES(tags),
            remark = VALUES(remark)
        `;

        const values = [
            data.id,
            data.staff_id,
            data.department,
            data.position,
            data.type,
            data.curve_name,
            data.statistics_style,
            data.condition_style,
            data.order,
            data.tags,
            data.remark
        ];

        connection.query(sqlQuery, values, (error, results, fields) => {
            if (error) reject(error);

            // 提取修改後的ID
            const modifiedId = results[1][0].id;

            // 返回查询结果和修改後的ID
            resolve({ results: results[0], modifiedId });
        });
    });
}

module.exports = {
    loadById,
    saveOrUpdate,
};
