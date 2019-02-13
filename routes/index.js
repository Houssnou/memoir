const router = require("express").Router();

// import html and api routes
const apiRoutes = require("./api");
const htmlRoutes = require("./html");
//clear

//fire up all routes 
router.use("/", htmlRoutes);
router.use("/api", apiRoutes);
//router.use("/auth", authRoutes);

module.exports = router;