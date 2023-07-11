const { connection } = require('./database');

function load(whereClause) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
            SELECT id,
              situation_id,
              points_base,
              points_technical_training_plus,
              points_management_training_plus,
              points_audit_case_plus,
              points_seniority_plus,
              points_job_status,
              points_working_hours,
              points_study_hours,
              points_writing_letters,
              points_attending_staff,
              points_non_submission,
              points_gi,
              points_gbs,
              points_total,
              remark
            FROM staff_situation_points
            WHERE ${whereClause}
            ORDER BY id
        `;

        connection.query(sqlQuery, (error, results, fields) => {
            if (error) reject(error);

            // return query result
            resolve(results);
        });
    });
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
            INSERT INTO staff_situation_points
            (situation_id, points_base, points_technical_training_plus, points_management_training_plus, points_audit_case_plus, points_seniority_plus, points_job_status, points_working_hours, points_study_hours, points_writing_letters, points_attending_staff, points_non_submission, points_gi, points_gbs, points_total, remark)
            VALUES ?
            ON DUPLICATE KEY UPDATE
            points_base = VALUES(points_base),
            points_technical_training_plus = VALUES(points_technical_training_plus),
            points_management_training_plus = VALUES(points_management_training_plus),
            points_audit_case_plus = VALUES(points_audit_case_plus),
            points_seniority_plus = VALUES(points_seniority_plus),
            points_job_status = VALUES(points_job_status),
            points_working_hours = VALUES(points_working_hours),
            points_study_hours = VALUES(points_study_hours),
            points_writing_letters = VALUES(points_writing_letters),
            points_attending_staff = VALUES(points_attending_staff),
            points_non_submission = VALUES(points_non_submission),
            points_gi = VALUES(points_gi),
            points_gbs = VALUES(points_gbs),
            points_total = VALUES(points_total),
            remark = VALUES(remark)
        `;

        const values = datas.map(data => [
          data.situation_id,
          data.points_base,
          data.points_technical_training_plus,
          data.points_management_training_plus,
          data.points_audit_case_plus,
          data.points_seniority_plus,
          data.points_job_status,
          data.points_working_hours,
          data.points_study_hours,
          data.points_writing_letters,
          data.points_attending_staff,
          data.points_non_submission,
          data.points_gi,
          data.points_gbs,
          data.points_total,
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
        WHERE situation_id = ${situationId}`

        connection.query(sqlQuery, (error, results, fields) => {
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
