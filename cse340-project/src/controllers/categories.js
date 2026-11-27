
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
    const oldInput = res.locals.messages?.oldInput?.[0];

    res.render("new-category", {
        title: "Create New Category",
        category: oldInput || {}
    });
};

// Process the new category form
const createNewCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        await createCategory(name.trim());

        req.flash("success", "Category created successfully.");

        return res.redirect("/categories");
    } catch (error) {
        if (error.code === "23505") {
            req.flash("error", "A category with this name already exists.");
            req.flash("oldInput", req.body);

            return res.redirect("/new-category");
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

        const oldInput = res.locals.messages?.oldInput?.[0];

        const formCategory = oldInput
            ? { ...category, ...oldInput }
            : category;

        res.render("edit-category", {
            title: "Edit Category",
            category: formCategory
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
            req.flash("error", "A category with this name already exists.");
            req.flash("oldInput", req.body);

            return res.redirect(`/edit-category/${req.params.id}`);
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
