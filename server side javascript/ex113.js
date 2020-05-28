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

app.get('/auth/logout', function(req, res){
  // delete req.session.displayName;
  req.logout();
  req.session.save(function(){
    res.redirect('/welcome');  // logout by callback.
  });
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

/*
  // login data.
  // var users = [
  //   {
  //     authId: 'local:john',
  //     username: 'john',
  //     // password: '5bd8ee450b3410da92c861769d812ebc', // '111' with md5 + salt
  //     // password: '9a544254a6b98096d67168764d00e623abd03677046e1d660c113729f5724362', // '111' with sha256
  //     password: 'DG66KtS0sThfIJiT0tLzYfFANT8L1Gt1NpqEBPULX+C73C3gG8nG3JOmOpNuf6USGpBH2NtcYkyfUOAIoMAfEzREFuPqNBr+Pg+tsxVfPsswegW19M81yvAViL83jQmYf4SKLkY1jS5XE61PJwT85DiNbFccZQHYAMkBzn17eBo=', // '111' with pbkdf2.
  //     // salt: '43534635634563456356',
  //     salt: 'wNiJDGG/V1TexQZTto4znAT1IH202QoytBHl2ldNakcBP3qW0ePfaBeFqqqFgXZhTxdxYSZPXW4z95Y52dIMyw==',  // salt with pbkdf2.
  //     displayName: 'Jonny'
  //   },
  //   {
  //     authId: 'local:lee',
  //     username: 'lee',
  //     // password: '2df004495bb875bfbdbceb12520e648c', // '111' with md5 + salt
  //     // password: '216f565cd7760c1de16e04b7abc629c57f16a83f8c91b03016bdc8dc41d9b08c', // '111' with sha256
  //     password: 'WRAjoFUnjl81sJLdaQntJeWL+3AP3Wx86XkQW6bcnUE+cf0ujgukAaUwc7HpyZLx+CIqr+/XZIuUwKwQt9iWM/slSZxybKG8ecNNmVc3jlz+jj7s1jfj3mBaeUyd6n6WZk4QI6aZBzGUO2K22nu+hpq7DIftaM9nf2530/Zj3Yk=', // '111' with pbkdf2.
  //     // salt: '65474835464564',
  //     salt: 'gZBy5nKV4hqARmIPXvWVYSpwlHOrjSL4ij2r6AgQAKGqwOft92kVt4d2Ka7SUjzWTVg6JSkxcbVKB4IJva7y6A==', // salt with pbkdf2.
  //     displayName: 'LEE'
  //   }
  // ];
*/
app.post('/auth/register', function(req, res){
  hasher({password: req.body.password}, function(err, pass, salt, hash){
    var user = {
      authId: 'local:' + req.body.username,
      username: req.body.username,
      password: hash,
      salt: salt,
      displayName: req.body.displayName
    };
    // add to database.
    // users.push(user);
    var sql = 'INSERT INTO users SET ?';
    conn.query(sql, user, function(err, results){
      if(err){
        console.log(err);
        res.status(500);  // 500 : internal server error.
      }else {
        req.login(user, function(err){
          req.flash('success', 'NEW local user registered...!');
          req.session.save(function(){
            res.redirect('/welcome');
          });
        });
      }
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

// local login.
app.post(
  '/auth/login',
  passport.authenticate(
    'local',  // use LocalStrategy
    {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login',
      successFlash: true,
      failureFlash: true
    }
  )
);

// facebook login (2 steps).
app.get(
  '/auth/facebook', // use FacebookStrategy
  passport.authenticate(
    'facebook',
    { scope: ['email', 'public_profile'] }
  )
);
app.get(
  '/auth/facebook/callback',
  passport.authenticate(
    'facebook',
    {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login',
      successFlash: true,
      failureFlash: true
    }
  )
);

app.get('/auth/login', function(req, res){
  var fmsg = req.flash();
  // console.log(fmsg);
  var feedback = '';
  if(fmsg.error){
    feedback = fmsg.error[0];
  }
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
  <h2>
    <font color="red">${feedback}</font>
  </h2>
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
