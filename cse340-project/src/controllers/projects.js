
import { getAllProjects } from "../models/projects.js";

const buildProjects = async (req, res, next) => {
    try {
        const projects = await getAllProjects();

        console.log(projects.rows);

        res.render("projects", {
            title: "Service Projects",
            projects: projects.rows
        });
    } catch (error) {
        next(error);
    }
};

export {
    buildProjects
};
