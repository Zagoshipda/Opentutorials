//63

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '022635',  //실제 코드를 구성하는 경우 별도의 파일을 만들어 비밀번호와 같은 보안정보를 소스코드에 포함시키지 않도록 하는 것이 보통이다
  // port     : '3306',
  database : 'o2'
});
conn.connect();

// SELECT
// var sql = 'SELECT * FROM topic';  //sql 문 작성
var sql = 'SELECT * FROM topic WHERE id = 2';
conn.query(sql, function(err, rows, fields){  //call back function
  if(err){
    console.log(err);
  } else {
    // for(var i=0; i<rows.length; i++){
    //   console.log(rows[i].title+": "+rows[i].description);
    // }

    console.log('rows[0] : ', rows[0]);
    console.log('rows', rows);  //rows 와 fields 가 무엇인지 확인해보자.
    // console.log('fields', fields);
  }
});

// // INSERT a new data into table
// var sql = 'INSERT INTO topic (title, description, author) VALUES("Nodejs", "Server side javascript", "egoing")';
// var sql = 'INSERT INTO topic (title, description, author) VALUES("Express", "Web framework", "duru")';  //그러나 이렇게 고정된 sql 문은 큰 의미가 없다. 왜냐하면 web application에서 nodejs 가 하는 일은 sql문을 프로그래밍적으로 동적으로 생성하고 이를 database 에 전달해서 data를 생성해내는 역할을 해야 하기 때문이다.

// //dynamic INSERT operation
// var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
// var params = ['Supervisor', 'Watcher', 'graphittie']; //? 물음표 치환자를 순서대로 값으로 치환. 보안과도 관련 - SQL injection attack
// //이렇게 params 를 선언하고 다음 query 내부의 callback function의 2번째 인자로 전달한다
// conn.query(sql, params, function(err, rows, fields){
//   if(err){
//     console.log(err);
//   } else {
//     console.log(rows.insertId);
//   }
// });

// UPDATE
// var sql = 'UPDATE topic SET title=?, author=? WHERE id=?';
// var params = ['NPM', 'LEEZCHE', '2']; //? 물음표 치환자를 순서대로 값으로 치환. 보안과도 관련 - SQL injection attack

// //DELETE
// var sql = 'DELETE FROM topic WHERE id=?'
// var params = [1];
//
// //이렇게 params 를 선언하고 다음 query 내부의 callback function의 2번째 인자로 전달한다
// conn.query(sql, params, function(err, rows, fields){
//   if(err){
//     console.log(err);
//   } else {
//     console.log(rows);
//   }
// });

conn.end(); //접속 자동종료
