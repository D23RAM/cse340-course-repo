
import express from "express";

import { buildHome } from "./controllers/index.js";
import { buildOrganizations } from "./controllers/organizations.js";
import { buildProjects } from "./controllers/projects.js";
import { buildCategories } from "./controllers/categories.js";
import {
    triggerError,
    pageNotFound,
    errorHandler
} from "./controllers/errors.js";

const router = express.Router();

// Home route
router.get("/", buildHome);

// Organizations route
router.get("/organizations", buildOrganizations);

// Projects route
router.get("/projects", buildProjects);

// Categories route
router.get("/categories", buildCategories);

// Test error route
router.get("/test-error", triggerError);

// Catch-all 404 handler
router.use(pageNotFound);

// Global error handler
router.use(errorHandler);

export default router;
