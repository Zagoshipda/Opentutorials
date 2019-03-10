// 61. node-mysql1 : 접속
// javascript 로 MySQL 을 제어하기 위해 MySQL 모듈을 불러와서 객체를 생성한 후 javascript code와 연결시키기

var mysql = require('mysql'); // mysql 객체 생성

//createConnection메서드의 인자로는 객체를 전달한다. 객체는 database connection과 관련된 가장 기초적이고 필수적인 정보들을 가지고 있다.
var conn = mysql.createConnection({
  host: 'localhost',  //서버가 위치하는 곳
  user : 'root',
  password: '022635', //실제 코드를 구성하는 경우 별도의 파일을 만들어 비밀번호와 같은 보안정보를 소스코드에 포함시키지 않도록 하는 것이 보통이다
  // port     : '3306',
  database : 'o2'
});
conn.connect(); //database server connection 생성

//query메서드를 이용하여 위에서 생성하여 접속한 database server에 query질의, 요청 을 보낼 수 있다
// 요청은 query 메서드의 첫번 째 인자로 string으로 전달하고, database server 는 해당 쿼리를 처리한 다음 nodejs로 응답을 보내주는데, 그 때 사용하는 방식이 server가 모든 작업을 마친 후 두번째 인자로 전달하는 콜백함수를 호출하는 것이다.
// 콜백함수는 3개의 매개변수를 가지는데, 순서대로 에러, rows는 가로행, fileds는 column들의 목록을 가지고 있다.

  // sample code-------------------
  // conn.qurey('...MySQL query...', function(err, rows, fields){
  //   if(err) throw err;
  //   console.log();
  // });

  // connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  //   if (error) throw error;
  //   console.log('The solution is: ', results[0].solution);
  // });
  //
  // connection.end();

var sql = 'SELECT * FROM topic';  //sql 문 작성, 이렇게 변수에 담아 놓고 변수를 query 메서드로 전달하는 것도 가능
conn.query(sql, function(err, rows, fields){  //call back function
  if(err){
    console.log(err);
  } else {
    console.log('rows', rows);  //rows 와 fields 가 무엇인지 확인해보자.
    console.log('fields', fields); //rows -> 가로 한 줄의 정보, fields -> column 정보
  }
});


conn.end(); //모든 작업이 끝나면 database server와의 접속을 종료한다.
