
import {
    getAllOrganizations,
    getOrganizationDetails
} from "../models/organizations.js";

import {
    getProjectsByOrganizationId
} from "../models/projects.js";

// Display all organizations
const buildOrganizations = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        res.render("organizations", {
            title: "Our Partner Organizations",
            organizations
        });
    } catch (error) {
        next(error);
    }
};

// Display one organization's details and service projects
const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const organizationId = req.params.id;

        // Validate that the ID contains only numbers
        if (!/^\d+$/.test(organizationId)) {
            return res.status(400).send("Invalid organization ID.");
        }

        const organizationDetails = await getOrganizationDetails(organizationId);

        // Display the 404 page if the organization does not exist
        if (!organizationDetails) {
            return res.status(404).render("404", {
                title: "Organization Not Found"
            });
        }

        const projects = await getProjectsByOrganizationId(organizationId);

        res.render("organization", {
            title: "Organization Details",
            organizationDetails,
            projects
        });
    } catch (error) {
        next(error);
    }
};

export {
    buildOrganizations,
    showOrganizationDetailsPage
};
