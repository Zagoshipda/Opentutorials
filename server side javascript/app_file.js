var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({storage: _storage});
var fs = require('fs');
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.locals.pretty = true;
