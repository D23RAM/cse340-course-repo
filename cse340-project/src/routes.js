
import express from "express";

import { buildHome } from "./controllers/index.js";
import {
    buildOrganizations,
    showOrganizationDetailsPage
} from "./controllers/organizations.js";
import {
    buildProjects,
    showProjectDetailsPage
} from "./controllers/projects.js";
import {
    buildCategories,
    showCategoryDetailsPage
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

// Projects routes
router.get("/projects", buildProjects);
router.get("/project/:id", showProjectDetailsPage);

// Categories routes
router.get("/categories", buildCategories);
router.get("/category/:id", showCategoryDetailsPage);
// Test error route
router.get("/test-error", triggerError);

// Catch-all 404 handler
router.use(pageNotFound);

// Global error handler
router.use(errorHandler);

export default router;
