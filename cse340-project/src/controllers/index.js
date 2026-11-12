
const buildHome = (req, res) => {
    res.render("index", {
        title: "Home"
    });
};

export {
    buildHome
};
