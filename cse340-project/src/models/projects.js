import db from "./db.js";

const getAllProjects = async () => {
    const sql = `
        SELECT
            service_project.*,
            organization.name AS organization_name
        FROM service_project
        INNER JOIN organization
        ON service_project.organization_id = organization.organization_id
        ORDER BY service_project.date;
    `;

    return await db.query(sql);
};

export { getAllProjects };