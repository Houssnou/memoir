module.exports = function(req, res, next) {
  console.log("hi there")
  if (req.user) {
    return next();
  }
  res.redirect("/");
};