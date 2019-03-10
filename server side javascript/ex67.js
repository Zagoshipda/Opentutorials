// 67. MySQL 12 : 웹앱 제작 - 편집(1)


var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.locals.pretty = true;
var fs = require('fs');
app.set('views', './views_mysql');
app.set('view engine', 'jade');
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

var mysql = require('mysql');
var conn = mysql.createConnection({ //conn 변수 -> MySQL connection control
  host     : 'localhost',
  user     : 'root',
  password : '022635',
  database : 'o2'
});
conn.connect();

// connect to port number 3000
app.listen(3000, function(){
  console.log('Connected 3000 port!');
});

  // app.get('/upload', function(req, res){
  //   res.render('upload');
  // });

  // app.post('/upload', upload.single('userfile'), function(req, res){
  //   res.send('Uploaded : '+req.file.filename);
  // });

app.get('/topic/add', function(req, res){
  var sql = 'SELECT id, title FROM topic';  //id, title 이 필요한 이유는 글목록을 생성할 때 링크 url 로 id가 필요하고 해당 url text 로 title이 필요하기 때문
  conn.query(sql, function(err, topics, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('add', {topics: topics});
  });
});

app.post('/topic/add', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;

  var sql = 'INSERT INTO topic(title, description, author) VALUES(?, ?, ?)';
  conn.query(sql, [title, description, author], function(err, result, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      // res.send(result); //debugging
      res.redirect('/topic/'+result.insertId);  //redirection, (rows->)result 변수가 가지고 있는 객체의 여러 값들 중 insertId 는 MySQL data table 에 추가된 id값을 가지고 있으므로 이를 활용해서 사용자에게 redirect할 url을 특정할 수 있다.
    }
  });
});

app.get(['/topic', '/topic/:id'], function(req, res){
  var sql = 'SELECT id, title FROM topic'; // **MySQL server 에서 data 읽어오기(READ) : topics 변수에 id, title 값이 들어있음
  conn.query(sql, function(err, topics, fields){  //rows -> topics
    // res.send(topics); //topics(rows)는 배열이고 각 원소로 table row data 객체를 가진다.
    var id = req.params.id;
    if(id){ //id 가 있는 경우-> 상세보기 -> 해당 data 항목이 가지는 모든 detail informatin을 가져와야함 -> select * 이 필요 -> 특정 id에 해당하는 모든 정보는 topic 변수가 가지고 있음
      var sql = 'SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], function(err, topic, fields){ //rows -> topic (이미 위쪽 query 콜백함수에서 topics 변수를 사용했으므로 다른 이름의 변수를 사용하기 위해 topic 사용)
        //만약 rows가 없다면 -> 없는 url id 에 접근하는 경우...
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }else{
          //현재 선택한 topic에 대한 세부정보를 topic 변수로 전달해보자.
          res.render('view', {topics:topics, topic:topic[0]});  //글목록 보여주는 부분 : 일단 topics 는 sql data를 모두 가지고 있는 것.  topic 인자는 특정 하나의 id값에 대응하는 세부적인 data를 모두 담고 있는 (원소의 개수가 1개인)배열 이므로 그 중 첫 번째 원소를 가져온다는 의미에서 [0]을 사용
        }
      });
    }else{  //id 가 없는 경우 - home url
      res.render('view', {topics:topics});  //view template file rendering
    }

  }); //end of query
});
