
import { body } from "express-validator";

import { getAllOrganizations } from "../models/organizations.js";
import { getAllCategories } from "../models/categories.js";

// Organization creation validation
const organizationCreateRules = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Organization name is required.")
        .bail()
        .isLength({ max: 150 })
        .withMessage("Organization name cannot exceed 150 characters."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Organization description is required."),

    body("contact_email")
        .trim()
        .notEmpty()
        .withMessage("Contact email is required.")
        .bail()
        .isEmail()
        .withMessage("Enter a valid email address.")
        .bail()
        .isLength({ max: 255 })
        .withMessage("Email cannot exceed 255 characters.")
];

// Organization editing validation
const organizationUpdateRules = [
    ...organizationCreateRules,

    body("logo_filename")
        .trim()
        .notEmpty()
        .withMessage("Organization image is required.")
        .bail()
        .isLength({ max: 255 })
        .withMessage("Image filename cannot exceed 255 characters.")
];

// Project creation and editing validation
const projectRules = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Project title is required.")
        .bail()
        .isLength({ max: 150 })
        .withMessage("Project title cannot exceed 150 characters."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Project description is required."),

    body("location")
        .trim()
        .notEmpty()
        .withMessage("Project location is required.")
        .bail()
        .isLength({ max: 255 })
        .withMessage("Project location cannot exceed 255 characters."),

    body("date")
        .trim()
        .notEmpty()
        .withMessage("Project date is required.")
        .bail()
        .isISO8601({ strict: true, strictSeparator: true })
        .withMessage("Enter a valid project date."),

    body("organization_id")
        .trim()
        .notEmpty()
        .withMessage("Select an organization.")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Select a valid organization.")
        .bail()
        .custom(async (value) => {
            const organizations = await getAllOrganizations();

            const exists = organizations.some(
                organization =>
                    Number(organization.organization_id) === Number(value)
            );

            if (!exists) {
                throw new Error("Selected organization does not exist.");
            }

            return true;
        })
];

// Category creation and editing validation
const categoryRules = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required.")
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage("Category name must contain between 3 and 100 characters.")
];

// Project category assignment validation
const projectCategoryRules = [
    body("category_ids")
        .custom(async (value) => {
            // No selected categories is allowed
            if (value === undefined) {
                return true;
            }

            const submittedIds = Array.isArray(value) ? value : [value];

            if (submittedIds.length === 0) {
                return true;
            }

            const validFormat = submittedIds.every(
                id => /^\d+$/.test(String(id)) && Number(id) > 0
            );

            if (!validFormat) {
                throw new Error("One or more selected category IDs are invalid.");
            }

            const categories = await getAllCategories();

            const existingIds = categories.map(
                category => Number(category.category_id)
            );

            const allExist = submittedIds.every(
                id => existingIds.includes(Number(id))
            );

            if (!allExist) {
                throw new Error("One or more selected categories do not exist.");
            }

            return true;
        })
];

export {
    organizationCreateRules,
    organizationUpdateRules,
    projectRules,
    categoryRules,
    projectCategoryRules
};
