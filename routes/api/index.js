const router = require("express").Router();

// importing all api routes user,journal and entry
const userRoute = require("./userRoutes");
const journalRoute = require("./journalRoutes");
const entryRoute = require("./entryRoutes");

// prefix api routes with their specific endpoint name
router.use("/users", userRoute);
router.use("/journals", journalRoute);
router.use("/entries", entryRoute)

module.exports = router;