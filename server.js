//import all dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const session = require('express-session');
const listEndpoints = require('express-list-endpoints');
const passport = require("./utils/middleware/passport-local");

// import routes
const routes = require("./routes");

//import models
const db = require("./models");


//set up the APP
const app = express();
const PORT = process.env.PORT || 5000;

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static("public"));

// We need to use sessions to keep track of our user's login status
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//fire up routes
app.use(routes);

// Syncing our sequelize models and then starting our express app
db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log("App running on server http://localhost:" + PORT);
    console.log(listEndpoints(app));
  });
});