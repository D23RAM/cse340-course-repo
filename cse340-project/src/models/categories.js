
import db from './db.js';

// Get all categories
const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `;

    const result = await db.query(query);
    return result.rows;
};

// Get one category by its ID
const getCategoryById = async (id) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

// Get all categories belonging to one service project
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT category.category_id, category.name
        FROM category
        INNER JOIN project_category
            ON category.category_id = project_category.category_id
        WHERE project_category.project_id = $1
        ORDER BY category.name;
    `;

    const result = await db.query(query, [projectId]);
    return result.rows;
};

// Get all service projects belonging to one category
const getProjectsByCategoryId = async (categoryId) => {
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
        INNER JOIN project_category
            ON service_project.project_id = project_category.project_id
        INNER JOIN organization
            ON service_project.organization_id = organization.organization_id
        WHERE project_category.category_id = $1
        ORDER BY service_project.date;
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows;
};

// Create a new category
const createCategory = async (name) => {
    const query = `
        INSERT INTO public.category (name)
        VALUES ($1)
        RETURNING category_id, name;
    `;

    const result = await db.query(query, [name]);
    return result.rows[0];
};

// Update an existing category
const updateCategory = async (id, name) => {
    const query = `
        UPDATE public.category
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id, name;
    `;

    const result = await db.query(query, [name, id]);
    return result.rows[0];
};

// Update the categories assigned to a service project
const updateProjectCategories = async (projectId, categoryIds) => {
    // First, remove the existing category assignments
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);

    // Then, insert the newly selected categories
    if (categoryIds.length > 0) {
        const insertQuery = `
            INSERT INTO project_category (project_id, category_id)
            SELECT $1, selected.category_id
            FROM unnest($2::integer[]) AS selected(category_id)
            ON CONFLICT DO NOTHING;
        `;

        await db.query(insertQuery, [projectId, categoryIds]);
    }
};

export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    createCategory,
    updateCategory,
    updateProjectCategories
};