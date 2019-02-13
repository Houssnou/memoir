const cloudinary = require('cloudinary');
const Formidable = require('formidable');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET
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
        req.body.title = fields.title;
        req.body.body = fields.body;
        console.log(req.body);
        next();
      });
    } else {
      req.body.title = fields.title;
      req.body.body = fields.body;
      next();
    }
  });
};