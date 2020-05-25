var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());  // cookie-parser middleware
app.get('/count', function(req, res){
  var count;
  if(req.cookies.count){
    count = parseInt(req.cookies.count);
  }
  else {
    count = 0;
  }
  count = count + 1;
  res.cookie('count', count);
  res.send('count : ' + count);
});

app.listen(3003, function(){
  console.log('Connected 3003 port...!');
});
