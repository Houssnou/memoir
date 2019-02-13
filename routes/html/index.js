const router = require("express").Router();
const htmlRoutes = require("./htmlRoutes");
//const authRoutes = require("./html/authRoutes");

router.use("/", htmlRoutes);

module.exports = router;