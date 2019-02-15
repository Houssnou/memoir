const router = require("express").Router();
const usersController = require("../../controllers/userController");
const cloudinaryMiddleware = require('../../utils/middleware/cloudinary');
const passport = require('../../utils/middleware/passport-local');

//method to handle user authentication login status and logout
router
  .route("/status")
  .get(usersController.userCheck);

router
  .route("/login")
  .post(passport.authenticate('local'), usersController.login);

router
  .route("/logout")
  .get((req, res) => {
    req.logout();
    res.redirect('/');
  });

// methods for /api/user (GET and POST) 
router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.register);

//methods for api/users/:id (PUT and DELETE)
router
  .route("/:id")
  .put(cloudinaryMiddleware,usersController.updateAccount)
  .delete(usersController.deleteUser);


module.exports = router;