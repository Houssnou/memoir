const router = require('express').Router();
const path = require('path');
const isAuthenticated = require('../../utils/middleware/isAuthenticated');

// set up authenticated check for all routes here
router.use(isAuthenticated);

module.exports = router;