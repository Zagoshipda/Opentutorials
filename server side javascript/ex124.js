/*jshint esversion: 6 */
var app = require('./config/mysql/express')();
var passport = require('./config/mysql/passport')(app);
var auth = require('./routes/mysql/auth')(passport);
app.use('/auth', auth);

// session data is stored in memory by default so that it could be removed after reloading.
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

app.listen(3003, function(){
  console.log('Connected 3003 port...!');
});
