const cloudinary = require('cloudinary');
const Formidable = require('formidable');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// upload image and send nexts part of route
module.exports = function (req, res, next) {
  const form = new Formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    console.log(fields);
    if (files.photo) {
      cloudinary.uploader.upload(files.photo.path, result => {
        console.log(result);
        req.body.photo = result.secure_url;
        req.body.firstName = fields.firstName;
        req.body.lastName = fields.lastName;
        console.log(req.body);
        next();
      });
    } else {
      req.body.firstName = fields.firstName;
      req.body.lastName = fields.lastName;
      next();
    }
  });
};