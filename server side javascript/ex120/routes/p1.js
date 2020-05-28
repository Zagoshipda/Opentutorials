// receive app argument from main.
module.exports = function(app){
  var express = require('express');

  // Router-level middleware.
  var route = express.Router();
  route.get('/r1', function(req, res){
    res.send('Hello /p1/r1');
  });
  route.get('/r2', function(req, res){
    res.send('Hello /p1/r2');
  });

  // use app from main.
  app.get('/p4/r1', function(req, res){
    res.send('Hello /p4/r1');
  });

  return route;
};
