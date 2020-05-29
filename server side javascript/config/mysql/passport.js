module.exports = function(app){
  var md5 = require('md5');
  var sha256 = require('sha256');
  var pbkfd2Password = require("pbkdf2-password");
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;

  var hasher = pbkfd2Password();
  var conn = require('./db')();

  app.use(passport.initialize());
  app.use(passport.session());

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

  return passport;
};
