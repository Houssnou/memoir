//import models dependency
const db = require("../models");
//sequelized operator AND
const Op = require("sequelize").Op;


module.exports = {
//select all entries from the selected journal
  getAllEntries: (req, res) => {
    db
      .Entries
      .findAll({
        where: {
          [Op.and] : [
            {          
             JournalId: req.params.journalId
            },
             { isTrashed:false}
          ]        
        },
        include: [db.Journals]
      })
      .then(dbEntries => {
        res.json(dbEntries);
      })
      .catch(err => {
        console.log("Select All Error: " + err);
        res.status(400).json(err);
      });
  },
  //select one specfic entryfrom the selected journal
  getOneEntry: (req, res) => {
    db
      .Entries
      .findOne({
        where: {
          JournalId: req.params.journalId
        },
        include: [db.Journals]
      })
      .then(dbEntries => {
        res.json(dbEntries);
      })
      .catch(err => {
        console.log("Select All Error: " + err);
        res.status(400).json(err);
      });
  },

  //add an entry to a journal
  addEntry: (req, res) => {
    //console.log (req.body)
    db
      .Entries
      .create({
        title: req.body.title,
        body: req.body.body,
        JournalId: req.body.journalId,
        UserId: req.body.userId
      })
      .then(result => {
        res.json(result)
      })
      .catch(err => {
        console.log("Create Entry Error: " + err);
        res.status(400).json(err);
      });
  },

  //update a entry /:id
  updateEntry: (req, res) => {
    // console.log(req.body);
    db
      .Entries
      .update({
        title: req.body.title,
        body: req.body.body
      }, {
        where: {
          id: req.params.id
        }
      }).then(result => {
        res.json(result)
      })
      .catch(err => {
        console.log("Journal Entry Error: " + err);
        res.status(400).json(err);
      });

  },

  //delete an entry /id since we not really deleting the journal but just changing its isTrashed status to true
  deleteEntry: (req, res) => {
    db
      .Entries
      .update({
        isTrashed: true
      }, {
        where: {
          id: req.params.id
        }
      }).then(result => {
        res.json(result)
      })
      .catch(err => {
        console.log("Entry Delete Error: " + err);
        res.status(400).json(err);
      });
  }
}