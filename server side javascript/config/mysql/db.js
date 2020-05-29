module.exports = function() {
  var mysql = require('mysql');

  var mysqlOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1111',
    database: 'o2'
  };

  var conn = mysql.createConnection(mysqlOptions);
  conn.connect();

  return conn;
};
