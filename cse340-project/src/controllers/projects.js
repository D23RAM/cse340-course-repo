
import {
    getUpcomingProjects,
    getProjectDetails
} from "../models/projects.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Display upcoming service projects
const buildProjects = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

        res.render("projects", {
            title: "Upcoming Service Projects",
            projects: projects
        });
    } catch (error) {
        next(error);
    }
};

// Display details for one service project
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const id = req.params.id;

        const project = await getProjectDetails(id);

        res.render("project", {
            title: project.title,
            project: project
        });
    } catch (error) {
        next(error);
    }
};

export {
    buildProjects,
    showProjectDetailsPage
};
