
import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./src/models/db.js";
import { getAllOrganizations } from "./src/models/organizations.js";
import { getAllProjects } from "./src/models/projects.js";
dotenv.config();
import { getAllCategories } from "./src/models/categories.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from the public folder
app.use(express.static("public"));

// Function to format page titles
const formatPageTitle = (title) => {
  return `${title} | Community Connect`;
};

// Home page
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Organizations page
app.get("/organizations", async (req, res) => {
  try {
    const organizations = await getAllOrganizations();

    console.log(organizations);

    const title = "Our Partner Organizations";
    res.render("organizations", { title, organizations });
  } catch (error) {
    console.error("Error retrieving organizations:", error);
    res.status(500).send("Error retrieving organizations.");
  }
});

// Service projects page
app.get("/projects", async (req, res) => {
    try {
        const projects = await getAllProjects();

        console.log(projects.rows);

        res.render("projects", {
            title: "Service Projects",
            projects: projects.rows
        });
    } catch (error) {
        console.error("Error retrieving projects:", error);
        res.status(500).send("Error retrieving projects.");
    }
});
// Categories page
app.get("/categories", async (req, res) => {
    try {
        const categories = await getAllCategories();

        console.log(categories);

        res.render("categories", {
            title: "Categories",
            categories
        });
    } catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).send("Error retrieving categories.");
    }
});

// Start the server
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
