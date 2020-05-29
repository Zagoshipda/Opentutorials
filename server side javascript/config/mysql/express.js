/*jshint esversion: 6 */
module.exports = function(){
  var express = require('express');
  var session = require('express-session');
  // var FileStore = require('session-file-store')(session);
  var MySQLStore = require('express-mysql-session')(session);
  var bodyParser = require('body-parser');
  var { expressCspHeader, NONE, SELF } = require('express-csp-header');
  var flash = require('connect-flash');

  var app = express();

  app.set('view engine', 'jade');
  app.set('views', './views/mysql');

  app.use(bodyParser.urlencoded({ extended: false }));

  var mysqlOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1111',
    database: 'o2'
  };

  app.use(session({
    secret: '12343452524',  // used when storing session-id on web browser.
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore(mysqlOptions),
    cookie: { maxAge : 180000 }  // cookie expire time im ms.
  }));

  app.use(expressCspHeader({
    directives: {
      'default-src': [NONE],
      'img-src': [SELF]
    }
  }));

  app.use(flash());

  return app;
};
