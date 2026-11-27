
import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
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

        if (!/^\d+$/.test(organizationId)) {
            return res.status(400).send("Invalid organization ID.");
        }

        const organizationDetails = await getOrganizationDetails(organizationId);

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

// Display the new organization form
const buildNewOrganization = (req, res) => {
    const oldInput = res.locals.messages?.oldInput?.[0];

    res.render("new-organization", {
        title: "Create New Organization",
        organization: oldInput || {},
        errors: {}
    });
};

// Process the new organization form
const createNewOrganization = async (req, res, next) => {
    try {
        const {
            name,
            description,
            contact_email
        } = req.body;

        // Automatically assign the default organization image
        const defaultImage = "community.svg";

        await createOrganization(
            name,
            description,
            contact_email,
            defaultImage
        );

        req.flash("success", "Organization created successfully.");

        return res.redirect("/organizations");
    } catch (error) {
        next(error);
    }
};

// Display the edit organization form
const buildEditOrganization = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!/^\d+$/.test(id)) {
            return res.status(400).send("Invalid organization ID.");
        }

        const organization = await getOrganizationDetails(id);

        if (!organization) {
            return res.status(404).render("404", {
                title: "Organization Not Found"
            });
        }

        // Restore submitted values after a validation failure
        const oldInput = res.locals.messages?.oldInput?.[0];

        const formOrganization = oldInput
            ? { ...organization, ...oldInput }
            : organization;

        res.render("edit-organization", {
            title: "Edit Organization",
            organization: formOrganization,
            errors: {}
        });
    } catch (error) {
        next(error);
    }
};

// Process the edit organization form
const updateOrganizationDetails = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!/^\d+$/.test(id)) {
            return res.status(400).send("Invalid organization ID.");
        }

        const {
            name,
            description,
            contact_email,
            logo_filename
        } = req.body;

        const existingOrganization = await getOrganizationDetails(id);

        if (!existingOrganization) {
            return res.status(404).render("404", {
                title: "Organization Not Found"
            });
        }

        await updateOrganization(
            id,
            name,
            description,
            contact_email,
            logo_filename
        );

        req.flash("success", "Organization updated successfully.");

        return res.redirect("/organizations");
    } catch (error) {
        next(error);
    }
};

export {
    buildOrganizations,
    showOrganizationDetailsPage,
    buildNewOrganization,
    createNewOrganization,
    buildEditOrganization,
    updateOrganizationDetails
};
