//import models dependency
const db = require("../models");


//sequelized operator AND
const Op = require("sequelize").Op;

module.exports = {
  //select all journals from the connected user 
  getAllJournals: (req, res) => {
    db
      .Journals
      .findAll({
        where: {
          [Op.and]: [{
            UserId: req.params.userId
            },
            {
              isTrashed: false
            }
          ]
        },
        include: [db.Users]
      })
      .then(dbJournals => {
        res.json(dbJournals);
      })
      .catch(err => {
        console.log("Select All Error: " + err);
        res.status(400).json(err);
      });
  },
  getAllDeletedJournals: (req, res) => {
    db
      .Journals
      .findAll({
        where: {
          [Op.and]: [{
              UserId: req.params.userId
            },
            {
              isTrashed: true
            }
          ]
        }
      })
      .then(dbJournals => {
        res.json(dbJournals);
      })
      .catch(err => {
        console.log("Select All Error: " + err);
        res.status(400).json(err);
      });
  },
  countAllEntries: (req, res) => {
    db
      .Entries
      .findAll({
        where: {
          JournalId: req.params.journalId
        }
      })
      .then(Entries => {
        res.json(Entries);
      })
      .catch(err => {
        console.log("Select All Error: " + err);
        res.status(400).json(err);
      });
  },
  //add a journal
  addJournal: (req, res) => {
    //console.log (req.body)
    db
      .Journals
      .create({
        title: req.body.title,
        description: req.body.description,
        UserId: req.body.userId
      })
      .then(result => {
        res.json(result)
      })
      .catch(err => {
        console.log("Create Journal Error: " + err);
        res.status(400).json(err);
      });
  },

  //update a Journal /:id
  updateJournal: (req, res) => {
    // console.log(req.body);
    db
      .Journals
      .update({
        title: req.body.title,
        description: req.body.description
      }, {
        where: {
          id: req.params.id
        }
      }).then(result => {
        res.json(result)
      })
      .catch(err => {
        console.log("Journal Update Error: " + err);
        res.status(400).json(err);
      });

  },

  //delete a journal /id since we not really deleting the journal but just changing its isTrashed status to true
  deleteJournal: (req, res) => {
    db
      .Journals
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
        console.log("Journal Delete Error: " + err);
        res.status(400).json(err);
      });

  }
}