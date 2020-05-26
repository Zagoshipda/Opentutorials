var express = require('express');
var session = require('express-session');
// var FileStore = require('session-file-store')(session);
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var md5 = require('md5');

var mysqlOptions = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1111',
  database: 'o2'
}

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '12343452524',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(mysqlOptions)
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

app.get('/auth/logout', function(req, res){
  delete req.session.displayName;
  req.session.save(function(){
    res.redirect('/welcome');  // logout by callback.
  });
});

app.get('/welcome', function(req, res){
  // res.send(req.session);
  if(req.session.displayName){
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <p>
        <a href="/welcome">HOME</a>
      </p>
      <p>
        <a href="/auth/logout">Logout</a>
      </p>
    `);
  }else {
    res.send(`
      <h1>Welcome</h1>
      go to <a href="/auth/login">Login</a>
    `);
  }
});

// login data.
var users = [{
  username: 'john',
  password: '698d51a19d8a121ce581499d7b701668', // '111'
  displayName: 'Jonny'
}];
app.post('/auth/login', function(req, res){
  var uname = req.body.username;
  var pwd = req.body.password;
  for(var i=0; i<users.length; ++i){
    var user = users[i];
    if(uname === user.username && md5(pwd) === user.password){
      req.session.displayName = user.displayName;
      // TODO: why return? -> to finish the function, NOT to execute outside the iteration.
      return req.session.save(function(){
        res.redirect('/welcome'); // go back to main page by callback.
      });
    }
  }
  var output = uname + ' ' + pwd + ' / ' + md5(pwd) + ' / ' + users[0].password;
  res.send(output + '<br>Who\nare you? <a href="/auth/login">go back to Login</a>');
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
  go to <a href="/welcome">HOME</a>
  `;
  res.send(output);
});

app.listen(3003, function(){
  console.log('Connected 3003 port...!');
});
