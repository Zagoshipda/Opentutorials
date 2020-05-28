module.exports = function(app){
  var express = require('express');

  // Router-level middleware.
  var route = express.Router();
  route.get('/r1', function(req, res){
    res.send('Hello /p3/r1');
  });
  route.get('/r2', function(req, res){
    res.send('Hello /p3/r2');
  });
  
  return route;
};
