//65. MySQL 10 : 웹앱 제작 읽기2 - 글 본문내용 상세보기
// 단축키: ctrl+| -> sidebar open/close

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.locals.pretty = true;
var fs = require('fs');
app.set('views', './views_mysql'); //파일을 읽어올 위치 : views_mysql 폴더
app.set('view engine', 'jade'); //jade engine 사용
  // var multer = require('multer');
  // var _storage = multer.diskStorage({
  //   destination: function (req, file, cb){
  //     cb(null, 'uploads/');
  //   },
  //   filename: function (req, file, cb) {
  //     cb(null, file.originalname);
  //   }
  // });
  // var upload = multer({storage: _storage});
  // app.use('/user', express.static('uploads'));

var mysql = require('mysql');  //MySQL을 javascript 로 제어하기 위해 모듈 추가
var conn = mysql.createConnection({ //제어하려는 MySQL database 정보를 입력
  host     : 'localhost',
  user     : 'root',
  password : '022635',
  database : 'o2'
});
conn.connect(); //database connection starts
// conn.end();

  // app.get('/upload', function(req, res){
  //   res.render('upload');
  // });

  // app.post('/upload', upload.single('userfile'), function(req, res){
  //   res.send('Uploaded : '+req.file.filename);
  // });

app.get('/topic/new', function(req, res){
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('new', {topics:files});
  });
});

// GET 방식의 접근 - url 입력을 통한 접근
// id url 접근 - home url & id url connection
app.get(['/topic', '/topic/:id'], function(req, res){
  // **MySQL server 에서 data 읽어오기(READ)
  var sql = 'SELECT id, title FROM topic'; //select * from topic, 일단 사용할 값들만 골라서 가져오도록 한다 -> topics 변수에 id, title 값이 들어있음
  conn.query(sql, function(err, topics, fields){  //rows -> topics
    // res.send(topics); //topics(rows)는 배열이고 각 원소로 table row data 객체를 가진다.
    var id = req.params.id;
    if(id){ //id 가 있는 경우-> 상세보기 -> 해당 data 항목이 가지는 모든 detail informatin을 가져와야함 -> select * 이 필요 -> 특정 id에 해당하는 모든 정보는 topic 변수가 가지고 있음
      var sql = 'SELECT * FROM topic WHERE id=?'; //치환자를 선언한 경우 query의 2번째 인자로 해당 대응하는 값을 (배열의 형태로-현재는 값이 1개인 경우)전달하면 된다. 하나의 행만 전달하기
      conn.query(sql, [id], function(err, topic, fields){ //rows -> topic (이미 위쪽 query 콜백함수에서 topics 변수를 사용했으므로 다른 이름의 변수를 사용하기 위해 topic 사용)
        //만약 rows가 없다면 -> 없는 url id 에 접근하는 경우...
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }else{
          //현재 선택한 topic에 대한 정보를 topic 변수로 전달해보자.
          // res.render('view', {topics:topics, topic:topic}); //지금은 id값이 특정되는 경우이므로 이것도 되지않나?? ->아무래도 query메서드의 콜백함수 2번째, 3번째 인자들은 배열의 형태로 값을 저장하고 있으므로 단 1개의 값만 가진다고 하더라도 그 값을 가져오기 위해서는 [0]번째 값을 가져와야 자료형이 맞을 것 같다.
          res.render('view', {topics:topics, topic:topic[0]});  //글목록 보여주는 부분 : 일단 topics 는 sql data를 모두 가지고 있는 것.  topic 인자는 data를 담고 있는 배열 이므로 그 중 첫 번째 원소를 가져온다는 의미에서 [0]을 사용한다
        }
      });
    }else{  //id 가 없는 경우 - home url
      res.render('view', {topics:topics});  //view template file rendering
    }

  }); //end of query

});

app.post('/topic', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title, description, function(err){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic/'+title);
  });
});

// 서버 포트 접속을 위해 필요
app.listen(3000, function(){
  console.log('Connected 3000 port!');
});
