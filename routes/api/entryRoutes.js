const router = require("express").Router();
const entriesController = require("../../controllers/entryController");

// methods for /api/entry/:journalId (GET) 
router
  .route("/journals/:journalId")
  .get(entriesController.getAllEntries);

// methods for /api/entry/:journalId (GET) 
router
  .route("/deleted/:journalId")
  .get(entriesController.getAllDeletedEntries);

// methods for /api/entries (POST) 
router
  .route("/")
  .post(entriesController.addEntry);

//methods for api/entries/:id (PUT and DELETE) //delete is just a put method that we change to act as a delete
router
  .route("/:id")
  .put(entriesController.updateEntry)
  .delete(entriesController.deleteEntry);


module.exports = router;