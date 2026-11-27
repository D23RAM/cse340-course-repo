
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

        const oldInput = res.locals.messages?.oldInput?.[0];

        let assignedIds;

        if (oldInput) {
            const submittedIds = oldInput.category_ids;

            assignedIds = submittedIds === undefined
                ? []
                : Array.isArray(submittedIds)
                    ? submittedIds.map(Number)
                    : [Number(submittedIds)];
        } else {
            assignedIds = assignedCategories.map(category =>
                Number(category.category_id)
            );
        }

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

        req.flash("success", "Project categories updated successfully.");

        return res.redirect(`/project/${id}`);
    } catch (error) {
        next(error);
    }
};

// Display the new project form
const buildNewProject = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const oldInput = res.locals.messages?.oldInput?.[0];

        res.render("new-project", {
            title: "Create New Service Project",
            project: oldInput || {},
            organizations
        });
    } catch (error) {
        next(error);
    }
};

// Process the new project form
const createNewProject = async (req, res, next) => {
    try {
        const {
            title,
            description,
            location,
            date,
            organization_id
        } = req.body;

        await createProject(
            Number(organization_id),
            title.trim(),
            description.trim(),
            location.trim(),
            date
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
        const oldInput = res.locals.messages?.oldInput?.[0];

        const formattedProject = {
            ...project,
            date: new Date(project.date).toISOString().slice(0, 10)
        };

        const formProject = oldInput
            ? { ...formattedProject, ...oldInput }
            : formattedProject;

        res.render("edit-project", {
            title: "Edit Service Project",
            project: formProject,
            organizations
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

        const {
            title,
            description,
            location,
            date,
            organization_id
        } = req.body;

        await updateProject(
            id,
            Number(organization_id),
            title.trim(),
            description.trim(),
            location.trim(),
            date
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
