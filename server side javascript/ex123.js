/*jshint esversion: 6 */
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
var mysql = require('mysql');
var flash = require('connect-flash');

var hasher = pbkfd2Password();

var mysqlOptions = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1111',
  database: 'o2'
};

var conn = mysql.createConnection(mysqlOptions);
conn.connect();

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'jade');
app.set('views', './views/mysql');

app.use(session({
  secret: '12343452524',  // used when storing session-id on web browser.
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(mysqlOptions),
  cookie: { maxAge : 180000 }  // cookie expire time im ms.
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressCspHeader({
  directives: {
    'default-src': [NONE],
    'img-src': [SELF]
  }
}));
app.use(flash());

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

app.get('/welcome', function(req, res){
  console.log('welcome :', req.session, ' / ', req.user);
  var fmsg = req.flash();
  console.log('flash message :', fmsg);
  var feedback = '';
  if(fmsg.success){
    feedback = fmsg.success[0];
  }
  // req.user property made from done(null, user) inside deserializeUser().
  if(req.user && req.user.displayName){
    res.send(`
      <h2>
        <font color="lightgreen">${feedback}</font>
      </h2>
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
      <h2>
        <font color="purple">${feedback}</font>
      </h2>
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

// serialize & deserialize data for a session.
// from now on, do NOT control session directly, but by using a passport.
// user parameter from done(null, user) inside the ...Strategy().
passport.serializeUser(function(user, done){
  console.log('serializeUser :', user);
  done(null, user.authId);  // username as an id, store in the session.
});

// id from the session, user.username stored from serializeUser().
passport.deserializeUser(function(id, done){
  console.log('deserializeUser :', id);
  var sql = 'SELECT * FROM users WHERE authId=?';
  conn.query(sql, [id], function(err, results){
    console.log('   :', sql, id, err, results);
    if(err){
      done('There is NO user...!');
    }else {
      done(null, results[0]);
    }
  });
  // for(var i=0; i<users.length; ++i){
  //   var user = users[i];
  //   if(user.authId === id){
  //     return done(null, user);  // Add user property to req object.
  //   }
  // }
  // TODO: Remove old session data for reloading.
  // Now we are using a maxAge property of cookie for a timeout.
  // done('There is NO user');
});

passport.use(new LocalStrategy(
  function(username, password, done){
    var uname = username;
    var pwd = password;
    // using MySQL.
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, ['local:' + uname], function(err, results){
      console.log('local results :', results);
      if(err){
        return done('Error during searching local user');
      }
      if(results.length <= 0){
        return done(null, false, { message: 'There is NO local user...!' });
      }
      var user = results[0];
      return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
        if(hash === user.password){
          console.log('LocalStrategy :', user);
          // done(err, result, message)
          return done(null, user, { message: 'Login Success...!' });  // Pass user to serializeUser().
        }else {
          return done(null, false, { message: 'Password wrong...!' });
        }
      });
    });
    // using hard-coded data.
    // for(var i=0; i<users.length; ++i){
    //   var user = users[i];
    //   if(uname === user.username){
    //     return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
    //       if(hash === user.password){
    //         console.log('LocalStrategy :', user);
    //         // done(err, result, message)
    //         return done(null, user);
    //         // req.session.displayName = user.displayName;
    //         // req.session.save(function(){
    //         //   res.redirect('/welcome');
    //         // });
    //       }else {
    //         return done(null, false);
    //       }
    //     });
    //   }
    // }
    // return done(null, false);
  }
));

passport.use(new FacebookStrategy(
  {
    clientID: '865984620559667',
    clientSecret: '2d5e4edc3d0d32a237b43db1327d50f0',
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email', 'gender', 'profileUrl', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    var authId = 'facebook:' + profile.id;
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, [authId], function(err, results){
      if(err){
        return done('Error during searching a facebook account');
      }
      if(results.length > 0){
        done(null, results[0], { message: 'Facebook login Success...!' }); // pass user value to serializeUser().
      }
      else {
        var sql = 'INSERT INTO users SET ?';
        var newuser = {
          'authId': authId,
          'displayName': profile.displayName,
          'email': profile.emails[0].value
        };
        conn.query(sql, newuser, function(err, results){
          if(err){
            console.log(err);
            done('Error during creating a new facebook account');
          }
          else {
            done(null, newuser, { message: 'New facebook login Success...!' }); // pass user value to serializeUser().
          }
        });
      }
    });
    // for(var i=0; i<users.length; ++i){
    //   var user = users[i];
    //   if(user.authId === authId){
    //     return done(null, user); // pass user value to serializeUser().
    //   }
    // }
    // var newuser = {
    //   'authId': authId,
    //   'displayName': profile.displayName,
    //   'email': profile.emails[0].value
    // };
    // users.push(newuser);
    // done(null, newuser);  // pass user value to serializeUser().
  }
));

var auth = require('./routes/mysql/auth')(passport);
app.use('/auth', auth);

app.listen(3003, function(){
  console.log('Connected 3003 port...!');
});
