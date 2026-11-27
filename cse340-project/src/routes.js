
import express from "express";
import { validationResult } from "express-validator";

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
    organizationCreateRules,
    organizationUpdateRules,
    projectRules,
    categoryRules,
    projectCategoryRules
} from "./middleware/validators.js";
import {
    triggerError,
    pageNotFound,
    errorHandler
} from "./controllers/errors.js";

const router = express.Router();

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    // Store validation messages and submitted form data
    req.flash("error", errors.array().map(error => error.msg));
    req.flash("oldInput", req.body);

    // Return to the corresponding form
    return res.redirect(req.originalUrl);
};

// Home
router.get("/", buildHome);

// Organizations
router.get("/organizations", buildOrganizations);
router.get("/organization/:id", showOrganizationDetailsPage);

router.get("/new-organization", buildNewOrganization);
router.post(
    "/new-organization",
    organizationCreateRules,
    handleValidationErrors,
    createNewOrganization
);

router.get("/edit-organization/:id", buildEditOrganization);
router.post(
    "/edit-organization/:id",
    organizationUpdateRules,
    handleValidationErrors,
    updateOrganizationDetails
);

// Projects
router.get("/projects", buildProjects);
router.get("/project/:id", showProjectDetailsPage);

router.get("/project/:id/categories", buildProjectCategories);
router.post(
    "/project/:id/categories",
    projectCategoryRules,
    handleValidationErrors,
    updateProjectCategoriesController
);

router.get("/new-project", buildNewProject);
router.post(
    "/new-project",
    projectRules,
    handleValidationErrors,
    createNewProject
);

router.get("/edit-project/:id", buildEditProject);
router.post(
    "/edit-project/:id",
    projectRules,
    handleValidationErrors,
    updateProjectDetails
);

// Categories
router.get("/categories", buildCategories);

router.get("/new-category", buildNewCategory);
router.post(
    "/new-category",
    categoryRules,
    handleValidationErrors,
    createNewCategory
);

router.get("/edit-category/:id", buildEditCategory);
router.post(
    "/edit-category/:id",
    categoryRules,
    handleValidationErrors,
    updateCategoryDetails
);

router.get("/category/:id", showCategoryDetailsPage);

// Test error route
router.get("/test-error", triggerError);

// 404 handler
router.use(pageNotFound);

// Global error handler
router.use(errorHandler);

export default router;
