
import { getAllCategories } from "../models/categories.js";

const buildCategories = async (req, res, next) => {
    try {
        const categories = await getAllCategories();

        console.log(categories);

        res.render("categories", {
            title: "Categories",
            categories
        });
    } catch (error) {
        next(error);
    }
};

export {
    buildCategories
};
