
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
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

export {
    buildCategories,
    showCategoryDetailsPage
};
