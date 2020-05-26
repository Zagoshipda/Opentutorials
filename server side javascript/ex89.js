var express = require('express');
var session = require('express-session');
// var FileStore = require('session-file-store')(session);
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var md5 = require('md5');
var sha256 = require('sha256');

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
var users = [
  {
    username: 'john',
    // password: '5bd8ee450b3410da92c861769d812ebc', // '111' with md5 + salt
    password: '9a544254a6b98096d67168764d00e623abd03677046e1d660c113729f5724362', // '111' with sha256
    salt: '43534635634563456356',
    displayName: 'Jonny'
  },
  {
    username: 'lee',
    // password: '2df004495bb875bfbdbceb12520e648c', // '111' with md5 + salt
    password: '216f565cd7760c1de16e04b7abc629c57f16a83f8c91b03016bdc8dc41d9b08c', // '111' with sha256
    salt: '65474835464564',
    displayName: 'LEE'
  }
];
app.post('/auth/login', function(req, res){
  var uname = req.body.username;
  var pwd = req.body.password;
  for(var i=0; i<users.length; ++i){
    var user = users[i];
    // if(uname === user.username && md5(pwd + user.salt) === user.password){
    if(uname === user.username && sha256(pwd + user.salt) === user.password){
      req.session.displayName = user.displayName;
      // TODO: why return? -> to finish the function, NOT to execute outside the iteration.
      return req.session.save(function(){
        res.redirect('/welcome'); // go back to main page by callback.
      });
    }
  }
  var output = uname + ' ' + pwd;
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
