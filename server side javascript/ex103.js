var express = require('express');
var session = require('express-session');
// var FileStore = require('session-file-store')(session);
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var md5 = require('md5');
var sha256 = require('sha256');
var pbkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var { expressCspHeader, NONE, SELF } = require('express-csp-header');

var hasher = pbkfd2Password();

var mysqlOptions = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1111',
  database: 'o2'
};

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '12343452524',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(mysqlOptions),
  cookie: { maxAge : 10000 }  // cookie expire time im ms.
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressCspHeader({
  directives: {
    'default-src': [NONE],
    'img-src': [SELF]
  }
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
  // delete req.session.displayName;
  req.logout();
  req.session.save(function(){
    res.redirect('/welcome');  // logout by callback.
  });
});

app.get('/welcome', function(req, res){
  console.log('welcome :', req.session, ' / ', req.user);
  // req.user property made from done(null, user) inside deserializeUser().
  if(req.user && req.user.displayName){
    res.send(`
      <h1>Hello, ${req.user.displayName}</h1>
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
      <p>
        go to <a href="/auth/login">Login</a>
      </p>
      <p>
        <a href="/auth/register">Register</a>
      </p>
    `);
  }
});

// login data.
var users = [
  {
    authId: 'local:john',
    username: 'john',
    // password: '5bd8ee450b3410da92c861769d812ebc', // '111' with md5 + salt
    // password: '9a544254a6b98096d67168764d00e623abd03677046e1d660c113729f5724362', // '111' with sha256
    password: 'DG66KtS0sThfIJiT0tLzYfFANT8L1Gt1NpqEBPULX+C73C3gG8nG3JOmOpNuf6USGpBH2NtcYkyfUOAIoMAfEzREFuPqNBr+Pg+tsxVfPsswegW19M81yvAViL83jQmYf4SKLkY1jS5XE61PJwT85DiNbFccZQHYAMkBzn17eBo=', // '111' with pbkdf2.
    // salt: '43534635634563456356',
    salt: 'wNiJDGG/V1TexQZTto4znAT1IH202QoytBHl2ldNakcBP3qW0ePfaBeFqqqFgXZhTxdxYSZPXW4z95Y52dIMyw==',  // salt with pbkdf2.
    displayName: 'Jonny'
  },
  {
    authId: 'local:lee',
    username: 'lee',
    // password: '2df004495bb875bfbdbceb12520e648c', // '111' with md5 + salt
    // password: '216f565cd7760c1de16e04b7abc629c57f16a83f8c91b03016bdc8dc41d9b08c', // '111' with sha256
    password: 'WRAjoFUnjl81sJLdaQntJeWL+3AP3Wx86XkQW6bcnUE+cf0ujgukAaUwc7HpyZLx+CIqr+/XZIuUwKwQt9iWM/slSZxybKG8ecNNmVc3jlz+jj7s1jfj3mBaeUyd6n6WZk4QI6aZBzGUO2K22nu+hpq7DIftaM9nf2530/Zj3Yk=', // '111' with pbkdf2.
    // salt: '65474835464564',
    salt: 'gZBy5nKV4hqARmIPXvWVYSpwlHOrjSL4ij2r6AgQAKGqwOft92kVt4d2Ka7SUjzWTVg6JSkxcbVKB4IJva7y6A==', // salt with pbkdf2.
    displayName: 'LEE'
  }
];

app.post('/auth/register', function(req, res){
  hasher({password: req.body.password}, function(err, pass, salt, hash){
    var user = {
      authId: 'local:' + req.body.username,
      username: req.body.username,
      password: hash,
      salt: salt,
      displayName: req.body.displayName
    };
    users.push(user); // add to database.
    // req.session.displayName = req.body.displayName; // login.
    req.login(user, function(err){
      req.session.save(function(){
        res.redirect('/welcome');
      });
    });
  });
});

app.get('/auth/register', function(req, res){
  var output = `
    <h1>Register</h1>
    <form action="/auth/register" method="post">
      <p>
        <input type="text" name="username" placeholder="username">
      </p>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="displayName" name="displayName" placeholder="displayName">
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
    go to <a href="/welcome">HOME</a>
  `;
  res.send(output);
});

// serialize & deserialize data for a session.
// from now on, do NOT control session directly, but by using a passport.
// user parameter from done(null, user) inside the LocalStrategy().
passport.serializeUser(function(user, done){
  console.log('serializeUser :', user);
  done(null, user.authId);  // username as an id, store in the session.
});

// id from the session, user.username stored from serializeUser().
passport.deserializeUser(function(id, done){
  console.log('deserializeUser : ', id);
  for(var i=0; i<users.length; ++i){
    var user = users[i];
    if(user.authId === id){
      return done(null, user);  // Add user property to req object.
    }
  }
  // TODO: Remove old session data for reloading.
  // Now we are using a maxAge property of cookie for a timeout.
  done('There is NO user');
  // User.findById(id, function(err, user){
  //   done(err, user);
  // });
});

passport.use(new LocalStrategy(
  function(username, password, done){
    var uname = username;
    var pwd = password;
    // var output = uname + ' ' + pwd;
    for(var i=0; i<users.length; ++i){
      var user = users[i];
      if(uname === user.username){
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy :', user);
            return done(null, user); // done(err, result, message)
            // req.session.displayName = user.displayName;
            // req.session.save(function(){
            //   res.redirect('/welcome');
            // });
          }else {
            return done(null, false);
            // res.send(output + '<br>Who\nare you? <a href="/auth/login">go back to Login</a>');
          }
        });
      }
    }
    return done(null, false);
    // res.send(output + '<br>Who\nare you? <a href="/auth/login">go back to Login</a>');
  }
));

passport.use(new FacebookStrategy({
    clientID: '865984620559667',
    clientSecret: '2d5e4edc3d0d32a237b43db1327d50f0',
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email', 'gender', 'profileUrl', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    var authId = 'facebook:' + profile.id;
    for(var i=0; i<users.length; ++i){
      var user = users[i];
      if(user.authId === authId){
        return done(null, user); // pass user value to serializeUser().
      }
    }
    var newuser = {
      'authId': authId,
      'displayName': profile.displayName,
      'email': profile.emails[0].value
    };
    users.push(newuser);
    done(null, newuser);  // pass user value to serializeUser().
    // User.findOrCreate(..., function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
  }
));

// local login.
app.post(
  '/auth/login',
  passport.authenticate(
    'local',  // use LocalStrategy
    {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login',
      failureFlash: false
    }
  )
);

// facebook login (2 steps).
app.get(
  '/auth/facebook', // use FacebookStrategy
  passport.authenticate(
    'facebook',
    { scope: 'email' }
  )
);
app.get(
  '/auth/facebook/callback',
  passport.authenticate(
    'facebook',
    {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login'
    }
  )
);

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
  <p>
    <h2>
      <a href="/auth/facebook">Facebook Login</a>
    </h2>
  </p>
  <p>
    go to <a href="/welcome">HOME</a>
  </p>
  `;
  res.send(output);
});

app.listen(3003, function(){
  console.log('Connected 3003 port...!');
});
