
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
    res.render("new-organization", {
        title: "Create New Organization",
        organization: {},
        errors: {}
    });
};

// Process the new organization form
const createNewOrganization = async (req, res, next) => {
    try {
        const {
            name,
            description,
            contact_email,
            logo_filename
        } = req.body;

        const errors = {};

        if (!name || !name.trim()) {
            errors.name = "Organization name is required.";
        } else if (name.trim().length > 150) {
            errors.name = "Organization name cannot exceed 150 characters.";
        }

        if (!description || !description.trim()) {
            errors.description = "Description is required.";
        }

        if (!contact_email || !contact_email.trim()) {
            errors.contact_email = "Contact email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email.trim())) {
            errors.contact_email = "Enter a valid email address.";
        } else if (contact_email.trim().length > 255) {
            errors.contact_email = "Email cannot exceed 255 characters.";
        }

        if (!logo_filename || !logo_filename.trim()) {
            errors.logo_filename = "Logo filename is required.";
        } else if (logo_filename.trim().length > 255) {
            errors.logo_filename = "Logo filename cannot exceed 255 characters.";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).render("new-organization", {
                title: "Create New Organization",
                organization: req.body,
                errors
            });
        }

        await createOrganization(
            name.trim(),
            description.trim(),
            contact_email.trim(),
            logo_filename.trim()
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

        res.render("edit-organization", {
            title: "Edit Organization",
            organization,
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

        const errors = {};

        if (!name || !name.trim()) {
            errors.name = "Organization name is required.";
        } else if (name.trim().length > 150) {
            errors.name = "Organization name cannot exceed 150 characters.";
        }

        if (!description || !description.trim()) {
            errors.description = "Description is required.";
        }

        if (!contact_email || !contact_email.trim()) {
            errors.contact_email = "Contact email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email.trim())) {
            errors.contact_email = "Enter a valid email address.";
        } else if (contact_email.trim().length > 255) {
            errors.contact_email = "Email cannot exceed 255 characters.";
        }

        if (!logo_filename || !logo_filename.trim()) {
            errors.logo_filename = "Logo filename is required.";
        } else if (logo_filename.trim().length > 255) {
            errors.logo_filename = "Logo filename cannot exceed 255 characters.";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).render("edit-organization", {
                title: "Edit Organization",
                organization: {
                    organization_id: id,
                    ...req.body
                },
                errors
            });
        }

        const updatedOrganization = await updateOrganization(
            id,
            name.trim(),
            description.trim(),
            contact_email.trim(),
            logo_filename.trim()
        );

        if (!updatedOrganization) {
            return res.status(404).render("404", {
                title: "Organization Not Found"
            });
        }

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
