
import { getAllOrganizations } from "../models/organizations.js";

const buildOrganizations = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        console.log(organizations);

        res.render("organizations", {
            title: "Our Partner Organizations",
            organizations
        });
    } catch (error) {
        next(error);
    }
};

export {
    buildOrganizations
};
