
const triggerError = (req, res, next) => {
    const error = new Error("This is a test error.");
    next(error);
};

const pageNotFound = (req, res) => {
    res.status(404).render("404", {
        title: "Page Not Found"
    });
};

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    res.status(500).render("500", {
        title: "Server Error"
    });
};

export {
    triggerError,
    pageNotFound,
    errorHandler
};
