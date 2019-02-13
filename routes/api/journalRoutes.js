const router = require("express").Router();
const journalsController = require("../../controllers/journalController");

// methods for /api/journals/:userId (GET) 
router
  .route("/users/:userId")
  .get(journalsController.getAllJournals);

// methods for /api/journals (POST) 
router
  .route("/")
  .post(journalsController.addJournal);

//methods for api/journals/:id (PUT and DELETE) //delete is just a put method that we change to act as a delete
router
  .route("/:id")
  .put(journalsController.updateJournal)
  .delete(journalsController.deleteJournal);


module.exports = router;