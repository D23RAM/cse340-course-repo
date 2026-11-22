
import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
} from "../models/projects.js";

import {
    getCategoriesByProjectId,
    getAllCategories,
    updateProjectCategories
} from "../models/categories.js";

import {
    getAllOrganizations
} from "../models/organizations.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Display upcoming service projects
const buildProjects = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

        res.render("projects", {
            title: "Upcoming Service Projects",
            projects
        });
    } catch (error) {
        next(error);
    }
};

// Display details for one service project
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const project = await getProjectDetails(id);

        if (!project) {
            return res.status(404).render("404", {
                title: "Project Not Found"
            });
        }

        const categories = await getCategoriesByProjectId(id);

        res.render("project", {
            title: project.title,
            project,
            categories
        });
    } catch (error) {
        next(error);
    }
};

// Display the category assignment form
const buildProjectCategories = async (req, res, next) => {
    try {
        const id = req.params.id;
        const project = await getProjectDetails(id);

        if (!project) {
            return res.status(404).render("404", {
                title: "Project Not Found"
            });
        }

        const allCategories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(id);

        const assignedIds = assignedCategories.map(category =>
            category.category_id
        );

        res.render("project-categories", {
            title: "Assign Project Categories",
            project,
            allCategories,
            assignedIds
        });
    } catch (error) {
        next(error);
    }
};

// Save category assignments
const updateProjectCategoriesController = async (req, res, next) => {
    try {
        const id = req.params.id;
        const project = await getProjectDetails(id);

        if (!project) {
            return res.status(404).render("404", {
                title: "Project Not Found"
            });
        }

        let categoryIds = req.body.category_ids || [];

        if (!Array.isArray(categoryIds)) {
            categoryIds = [categoryIds];
        }

        categoryIds = categoryIds
            .map(Number)
            .filter(id => Number.isInteger(id) && id > 0);

        await updateProjectCategories(id, categoryIds);

        return res.redirect(`/project/${id}`);
    } catch (error) {
        next(error);
    }
};

// Display the new project form
const buildNewProject = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        res.render("new-project", {
            title: "Create New Service Project",
            project: {},
            organizations,
            errors: {}
        });
    } catch (error) {
        next(error);
    }
};

// Validate project form data
const validateProject = (project, organizations) => {
    const errors = {};

    if (!project.title || !project.title.trim()) {
        errors.title = "Project title is required.";
    } else if (project.title.trim().length > 150) {
        errors.title = "Project title cannot exceed 150 characters.";
    }

    if (!project.description || !project.description.trim()) {
        errors.description = "Project description is required.";
    }

    if (!project.location || !project.location.trim()) {
        errors.location = "Project location is required.";
    } else if (project.location.trim().length > 255) {
        errors.location = "Project location cannot exceed 255 characters.";
    }

    if (!project.date || !/^\d{4}-\d{2}-\d{2}$/.test(project.date)) {
        errors.date = "Enter a valid project date.";
    } else {
        const parsedDate = new Date(`${project.date}T00:00:00Z`);
        if (
            Number.isNaN(parsedDate.getTime()) ||
            parsedDate.toISOString().slice(0, 10) !== project.date
        ) {
            errors.date = "Enter a valid project date.";
        }
    }

    const organizationId = Number(project.organization_id);

    if (
        !project.organization_id ||
        !Number.isInteger(organizationId) ||
        !organizations.some(org => org.organization_id === organizationId)
    ) {
        errors.organization_id = "Select a valid organization.";
    }

    return errors;
};

// Process the new project form
const createNewProject = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const errors = validateProject(req.body, organizations);

        if (Object.keys(errors).length > 0) {
            return res.status(400).render("new-project", {
                title: "Create New Service Project",
                project: req.body,
                organizations,
                errors
            });
        }

        await createProject(
            Number(req.body.organization_id),
            req.body.title.trim(),
            req.body.description.trim(),
            req.body.location.trim(),
            req.body.date
        );

        req.flash("success", "Service project created successfully.");

        return res.redirect("/projects");
    } catch (error) {
        next(error);
    }
};

// Display the edit project form
const buildEditProject = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!/^\d+$/.test(id)) {
            return res.status(400).send("Invalid project ID.");
        }

        const project = await getProjectDetails(id);

        if (!project) {
            return res.status(404).render("404", {
                title: "Project Not Found"
            });
        }

        const organizations = await getAllOrganizations();

        const formattedProject = {
            ...project,
            date: new Date(project.date).toISOString().slice(0, 10)
        };

        res.render("edit-project", {
            title: "Edit Service Project",
            project: formattedProject,
            organizations,
            errors: {}
        });
    } catch (error) {
        next(error);
    }
};

// Process the edit project form
const updateProjectDetails = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!/^\d+$/.test(id)) {
            return res.status(400).send("Invalid project ID.");
        }

        const existingProject = await getProjectDetails(id);

        if (!existingProject) {
            return res.status(404).render("404", {
                title: "Project Not Found"
            });
        }

        const organizations = await getAllOrganizations();
        const errors = validateProject(req.body, organizations);

        if (Object.keys(errors).length > 0) {
            return res.status(400).render("edit-project", {
                title: "Edit Service Project",
                project: {
                    project_id: id,
                    ...req.body
                },
                organizations,
                errors
            });
        }

        await updateProject(
            id,
            Number(req.body.organization_id),
            req.body.title.trim(),
            req.body.description.trim(),
            req.body.location.trim(),
            req.body.date
        );

        req.flash("success", "Service project updated successfully.");

        return res.redirect("/projects");
    } catch (error) {
        next(error);
    }
};

export {
    buildProjects,
    showProjectDetailsPage,
    buildProjectCategories,
    updateProjectCategoriesController,
    buildNewProject,
    createNewProject,
    buildEditProject,
    updateProjectDetails
};
