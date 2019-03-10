
// making and managing data on web application with MySQL 


var express = require('express');
var bodyParser = require('body-parser');
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
var fs = require('fs');
var mysql      = require('mysql');  //MySQL을 javascript 로 제어하기 위해 모듈 추가
var conn = mysql.createConnection({ //제어하려는 MySQL database 정보를 입력
  host     : 'localhost',
  user     : 'root',
  password : '022635',  //실제 코드를 구성하는 경우 별도의 파일을 만들어 비밀번호와 같은 보안정보를 소스코드에 포함시키지 않도록 하는 것이 보통이다
  // port     : '3306',
  database : 'o2'
});
conn.connect(); //연결 시작

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.locals.pretty = true;

// app.use('/user', express.static('uploads'));
app.set('views', './views_mysql'); //파일을 읽어올 위치 설정
app.set('view engine', 'jade'); //jade engine 사용
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
  var sql = 'SELECT id, title FROM topic'; //select * from topic, 일단 사용할 값들만 골라서 가져오도록 한다
  conn.query(sql, function(err, topics, fields){
    var id = req.params.id;
    if(id){ //id 가 있는 경우-> 상세보기
      var sql = 'SELECT * FROM topic WHERE id=?'; //치환자를 선언한 경우 query의 2번째 인자로 해당 대응하는 값을 (배열의 형태로-현재는 값이 1개인 경우)전달하면 된다. 하나의 행만 전달하기
      conn.query(sql, [id], function(err, topic, fields){ //rows -> topic
        //만약 rows가 없다면 -> 없는 url id 에 접근하는 경우...
        if(err){
          console.log(err);
        }else{
          // res.render('view', {topics:topics, topic:topic}); //지금은 id값이 특정되는 경우이므로 이것도 되지않나??
          res.render('view', {topics:topics, topic:topic[0]});  //글목록 보여주는 부분 : 일단 topics 는 sql data를 모두 가지고 있는 것.  topic 인자는 data를 답고 있는 배열 이므로 그 중 첫 번째 원소를 가져온다는 의미에서 [0]을 사용한다
        }
      });
    }else{  //id 가 없는 경우 - home url
      res.render('view', {topics:topics});  //view template file rendering
    }
    // res.send(rows); //rows 에는 data 객체 들이 배열로 들어있다
  });

});
app.post('topic', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title, description, function(err){
    if(err){

    }
  });
});

// 서버 포트 접속을 위해 필요
app.listen(3000, function(){
  console.log('Connected 3000 port!');
});
