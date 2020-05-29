var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
// app.use('/user', express.static('uploads'));

app.locals.pretty = true;
// var fs = require('fs');
app.set('views', './views/mysql');
app.set('view engine', 'jade');
  // var multer = require('multer');
  // var _storage = multer.diskStorage({
  //   destination: function (req, file, cb){
  //     cb(null, 'uploads/');
  //   },
  //   filename: function (req, file, cb) {
  //     cb(null, file.originalname);
  //   }
  // });
  // var upload = multer({storage: _storage});
  // app.use('/user', express.static('uploads'));

// route.
var topic = require('./routes/mysql/topic')();
app.use('/topic', topic);

// connect to port number 3000
app.listen(3000, function(){
  console.log('Connected 3000 port!');
});

  // app.get('/upload', function(req, res){
  //   res.render('upload');
  // });
  //
  // app.post('/upload', upload.single('userfile'), function(req, res){
  //   res.send('Uploaded : '+req.file.filename);
  // });
