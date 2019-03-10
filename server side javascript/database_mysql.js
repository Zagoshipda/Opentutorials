//61번째 강의 node-mysql1 : 접속

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '022635',
  database : 'o2'
});

conn.connect(); //접속 시작


conn.end(); //접속 자동종료
