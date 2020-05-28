var express = require('express');
var app = express();

var p1 = require('./routes/p1');
app.use('/p1', p1);

var p3 = require('./routes/p3');
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
