
import express from "express";

import { buildHome } from "./controllers/index.js";

import {
    buildOrganizations,
    showOrganizationDetailsPage,
    buildNewOrganization,
    createNewOrganization,
    buildEditOrganization,
    updateOrganizationDetails
} from "./controllers/organizations.js";

import {
    buildProjects,
    showProjectDetailsPage,
    buildProjectCategories,
    updateProjectCategoriesController,
    buildNewProject,
    createNewProject,
    buildEditProject,
    updateProjectDetails
} from "./controllers/projects.js";
import {
    buildCategories,
    showCategoryDetailsPage,
    buildNewCategory,
    createNewCategory,
    buildEditCategory,
    updateCategoryDetails
} from "./controllers/categories.js";

import {
    triggerError,
    pageNotFound,
    errorHandler
} from "./controllers/errors.js";

const router = express.Router();

// Home route
router.get("/", buildHome);

// Organizations routes
router.get("/organizations", buildOrganizations);
router.get("/organization/:id", showOrganizationDetailsPage);
router.get("/new-organization", buildNewOrganization);
router.post("/new-organization", createNewOrganization);
router.get("/edit-organization/:id", buildEditOrganization);
router.post("/edit-organization/:id", updateOrganizationDetails);

// Projects routes
router.get("/projects", buildProjects);
router.get("/project/:id", showProjectDetailsPage);
router.get("/project/:id/categories", buildProjectCategories);
router.post("/project/:id/categories", updateProjectCategoriesController);

// Create project
router.get("/new-project", buildNewProject);
router.post("/new-project", createNewProject);

// Edit project
router.get("/edit-project/:id", buildEditProject);
router.post("/edit-project/:id", updateProjectDetails);
// Categories routes
router.get("/categories", buildCategories);
router.get("/new-category", buildNewCategory);
router.post("/new-category", createNewCategory);
router.get("/edit-category/:id", buildEditCategory);
router.post("/edit-category/:id", updateCategoryDetails);
router.get("/category/:id", showCategoryDetailsPage);

// Test error route
router.get("/test-error", triggerError);

// Catch-all 404 handler
router.use(pageNotFound);

// Global error handler
router.use(errorHandler);

export default router;
