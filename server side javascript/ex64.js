//64. MySQL 9 : 웹앱 제작 읽기1 - 글목록
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
  var sql = 'SELECT id, title FROM topic'; //select * from topic, 일단 사용할 값들만 골라서 가져오도록 한다
  conn.query(sql, function(err, topics, fields){  //rows -> topics
    // res.send(topics); //topics(rows)는 배열이고 각 원소로 table row data 객체를 가진다.
    res.render('view', {topics:topics});  //view template file rendering

  }); //end of query

  // file system을 이용한 READ
  // fs.readdir('data', function(err, files){
  //   if(err){
  //     console.log(err);
  //     res.status(500).send('Internal Server Error');
  //   }
  //   var id = req.params.id;
  //   if(id){ //// id 값이 있을 때
  //     fs.readFile('data/'+id, 'utf8', function(err, data){
  //       if(err){
  //         console.log(err);
  //         res.status(500).send('Internal Server Error');
  //       }
  //       res.render('view', {topics:files, title:id, description:data});
  //     });
  //   }else{  //id 값이 없을 때 (home url)
  //     res.render('view', {topics:files, title:'Welcome', description:'Hello, JavaScript for server.'});
  //   }
  // });
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
