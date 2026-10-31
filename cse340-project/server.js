import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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
app.get("/organizations", (req, res) => {
  res.render("organizations", { title: "Organizations" });
});

// Service projects page
app.get("/projects", (req, res) => {
  res.render("projects", { title: "Service Projects" });
});

// Categories page
app.get("/categories", (req, res) => {
  res.render("categories", { title: "Categories" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});