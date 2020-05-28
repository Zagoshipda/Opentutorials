var express = require('express');
var app = express();

app.set('view engine', 'jade'); // template engine.
app.set('views', 'jade');       // template files.

// routes.
app.get('/view', function(req,res){
  res.render('view');
});

app.get('/add', function(req, res){
  res.render('add');
});

app.listen(3003, function(){
  console.log('Connect 3003 port...!');
});
