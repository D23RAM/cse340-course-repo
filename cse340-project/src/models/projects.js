
import db from "./db.js";

// Get all service projects
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

// Get service projects belonging to one organization
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY date;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

export { getAllProjects, getProjectsByOrganizationId };
