
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

    const result = await db.query(query, [organizationId]);
    return result.rows;
};

// Get the next upcoming service projects
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            service_project.project_id,
            service_project.title,
            service_project.description,
            service_project.date,
            service_project.location,
            service_project.organization_id,
            organization.name AS organization_name
        FROM service_project
        INNER JOIN organization
        ON service_project.organization_id = organization.organization_id
        WHERE service_project.date >= CURRENT_DATE
        ORDER BY service_project.date ASC
        LIMIT $1;
    `;

    const result = await db.query(query, [number_of_projects]);
    return result.rows;
};

// Get details for one service project
const getProjectDetails = async (id) => {
    const query = `
        SELECT
            service_project.project_id,
            service_project.title,
            service_project.description,
            service_project.date,
            service_project.location,
            service_project.organization_id,
            organization.name AS organization_name
        FROM service_project
        INNER JOIN organization
        ON service_project.organization_id = organization.organization_id
        WHERE service_project.project_id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] || null;
};

// Create a new service project
const createProject = async (
    organizationId,
    title,
    description,
    location,
    date
) => {
    const query = `
        INSERT INTO service_project
            (organization_id, title, description, location, date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            project_id,
            organization_id,
            title,
            description,
            location,
            date;
    `;

    const result = await db.query(query, [
        organizationId,
        title,
        description,
        location,
        date
    ]);

    return result.rows[0];
};

// Update an existing service project
const updateProject = async (
    projectId,
    organizationId,
    title,
    description,
    location,
    date
) => {
    const query = `
        UPDATE service_project
        SET
            organization_id = $1,
            title = $2,
            description = $3,
            location = $4,
            date = $5
        WHERE project_id = $6
        RETURNING
            project_id,
            organization_id,
            title,
            description,
            location,
            date;
    `;

    const result = await db.query(query, [
        organizationId,
        title,
        description,
        location,
        date,
        projectId
    ]);

    return result.rows[0] || null;
};

export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
};
