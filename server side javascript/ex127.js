var app = require('./config/mysql/express')();
var passport = require('./config/mysql/passport')(app);
var auth = require('./routes/mysql/auth')(passport);
app.use('/auth', auth); // directory under '/auth'.

var topic = require('./routes/mysql/topic')();
app.use('/topic', topic);

// main page.
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
      <div>
        <a href="/topic">topic list</a>
      </div>
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
      <div>
        <a href="/topic">topic list</a>
      </div>
      <p>
        go to <a href="/auth/login">Login</a>
      </p>
      <p>
        <a href="/auth/register">Register</a>
      </p>
    `);
  }
});

// connect to port number 3000
app.listen(3000, function(){
  console.log('Connected 3000 port!');
});
