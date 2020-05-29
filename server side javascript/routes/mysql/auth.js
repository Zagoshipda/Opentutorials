module.exports = function(passport){
  // application level -> route level
  var route = require('express').Router();

  // local login.
  route.post(
    '/login',
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
  route.get(
    '/facebook', // use FacebookStrategy
    passport.authenticate(
      'facebook',
      { scope: ['email', 'public_profile'] }
    )
  );
  route.get(
    '/facebook/callback',
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

  route.get('/login', function(req, res){
    var fmsg = req.flash();
    // console.log(fmsg);
    var feedback = '';
    if(fmsg.error){
      feedback = fmsg.error[0];
    }
    res.render('auth/login', {feedback: feedback});
  });

  route.post('/register', function(req, res){
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

  route.get('/register', function(req, res){
    res.render('auth/register');
  });

  route.get('/logout', function(req, res){
    // delete req.session.displayName;
    req.logout();
    req.flash('success', 'Logout success...!');
    req.session.save(function(){
      res.redirect('/welcome');  // logout by callback.
    });
  });

  return route;
};
