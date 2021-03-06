var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
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

app.post('/auth/login', function(req, res){
  // login data.
  var user = {
    username:'john',
    password:'111'
  };
  var uname = req.body.username;
  var pwd = req.body.password;
  var output = uname + ' ' + pwd;
  if(uname === user.username && pwd === user.password){
    // res.send(output + '<br>Hello\nmaster');
    res.redirect('/welcome'); // go back to main page.
  }else {
    res.send(output + '<br>Who\nare you? <a href="/auth/login">go back to Login</a>');
  }
});

app.get('/auth/login', function(req, res){
  var output = `
  <h1>Login</h1>
  <form action="/auth/login" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
  res.send(output);
});

app.listen(3003, function(){
  console.log('Connected 3003 port...!');
});
