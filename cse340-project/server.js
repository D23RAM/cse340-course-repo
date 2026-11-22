
import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./src/models/db.js";
import router from "./src/routes.js";
import session from "express-session";
import flash from "connect-flash";
dotenv.config();

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");

// Middleware to log incoming requests in development mode
app.use((req, res, next) => {
    if (NODE_ENV === "development") {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Make NODE_ENV available to all EJS templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// Serve static files
app.use(express.static("public"));

// Parse form submission data
app.use(express.urlencoded({ extended: true }));

// Configure sessions
app.use(session({
    secret: process.env.SESSION_SECRET || "community-connect-development-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: "auto",
        httpOnly: true,
        maxAge: 1000 * 60 * 30
    }
}));

// Configure flash messages
app.use(flash());

// Make flash messages available to EJS templates
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

// Use the application routes
app.use(router);

// Start the server
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
});
