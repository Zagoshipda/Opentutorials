var express = require('express');
var app = express();

// Router-level middleware.
var p1 = express.Router();
p1.get('/r1', function(req, res){
  res.send('Hello /p1/r1');
});
p1.get('/r2', function(req, res){
  res.send('Hello /p1/r2');
});
app.use('/p1', p1);

var p3 = express.Router();
p3.get('/r1', function(req, res){
  res.send('Hello /p3/r1');
});
p3.get('/r2', function(req, res){
  res.send('Hello /p3/r2');
});
app.use('/p3', p3);

// Application-level middleware.
app.get('/p2/r1', function(req, res){
  res.send('Hello /p2/r1');
});
app.get('/p2/r2', function(req, res){
  res.send('Hello /p2/r2');
});

app.listen(3003, function(){
  console.log('Connected 3003 port...!');
});
