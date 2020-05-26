var express = require('express');
var session = require('express-session');
var app = express();
app.use(session({
  secret: '12343452524',
  resave: false,
  saveUninitialized: true
}));

// session data is stored in memory by default so that it could be removed.
app.get('/count', function(req, res){
  if(req.session.count){
    req.session.count++;
  }else {
    req.session.count = 1;
  }
  res.send('count : ' + req.session.count);
});

// confirm session data.
app.get('/tmp', function(req, res){
  res.send('result : ' + req.session.count);
});

app.listen(3003, function(){
  console.log('Connected 3003 port...!');
});
