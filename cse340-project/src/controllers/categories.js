
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    createCategory,
    updateCategory
} from "../models/categories.js";

// Display all categories
const buildCategories = async (req, res, next) => {
    try {
        const categories = await getAllCategories();

        res.render("categories", {
            title: "Categories",
            categories
        });
    } catch (error) {
        next(error);
    }
};

// Display details for one category
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await getCategoryById(id);

        if (!category) {
            return res.status(404).render("404", {
                title: "Category Not Found"
            });
        }

        const projects = await getProjectsByCategoryId(id);

        res.render("category", {
            title: category.name,
            category,
            projects
        });
    } catch (error) {
        next(error);
    }
};

// Display the new category form
const buildNewCategory = (req, res) => {
    res.render("new-category", {
        title: "Create New Category",
        errors: {},
        category: {}
    });
};

// Process the new category form
const createNewCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const errors = {};

        if (!name || !name.trim()) {
            errors.name = "Category name is required.";
        } else if (name.trim().length < 3) {
            errors.name = "Category name must be at least 3 characters.";
        } else if (name.trim().length > 100) {
            errors.name = "Category name cannot exceed 100 characters.";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).render("new-category", {
                title: "Create New Category",
                errors,
                category: { name }
            });
        }

        await createCategory(name.trim());

        req.flash("success", "Category created successfully.");

        return res.redirect("/categories");
    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).render("new-category", {
                title: "Create New Category",
                errors: {
                    name: "A category with this name already exists."
                },
                category: {
                    name: req.body.name
                }
            });
        }

        next(error);
    }
};

// Display the edit category form
const buildEditCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await getCategoryById(id);

        if (!category) {
            return res.status(404).render("404", {
                title: "Category Not Found"
            });
        }

        res.render("edit-category", {
            title: "Edit Category",
            category,
            errors: {}
        });
    } catch (error) {
        next(error);
    }
};

// Process the edit category form
const updateCategoryDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { name } = req.body;
        const errors = {};

        if (!name || !name.trim()) {
            errors.name = "Category name is required.";
        } else if (name.trim().length < 3) {
            errors.name = "Category name must be at least 3 characters.";
        } else if (name.trim().length > 100) {
            errors.name = "Category name cannot exceed 100 characters.";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).render("edit-category", {
                title: "Edit Category",
                category: { category_id: id, name },
                errors
            });
        }

        const updatedCategory = await updateCategory(id, name.trim());

        if (!updatedCategory) {
            return res.status(404).render("404", {
                title: "Category Not Found"
            });
        }

        req.flash("success", "Category updated successfully.");

        return res.redirect("/categories");
    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).render("edit-category", {
                title: "Edit Category",
                category: {
                    category_id: req.params.id,
                    name: req.body.name
                },
                errors: {
                    name: "A category with this name already exists."
                }
            });
        }

        next(error);
    }
};

export {
    buildCategories,
    showCategoryDetailsPage,
    buildNewCategory,
    createNewCategory,
    buildEditCategory,
    updateCategoryDetails
};
