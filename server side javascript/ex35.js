//35 웹 앱 제작 --- 본문저장 (파일 기반 data저장)

//Express: web framework for Node.js
var express = require('express'); //node_modules 에 있는 express 모듈 추가
var app = express();  //애플리케이션 객체 만들기. express 함수 실행. 리턴하는 애플리케이션 객체를 app 변수로 제어
app.set('views', './views_file'); //template files from, views_file
app.set('view engine', 'jade'); //template engine 으로 jade를 사용
app.locals.pretty = true; //view page source - jade template file을 기반으로 만들어진 html을 더 보기 좋게 바꾸어주기

//post 방식으로 전달된 데이터 받아서 사용하기 -> body parser 필요
//앞으로 post방식의 모든 요청이 들어오면 bodyparser를 거쳐서 req 객체에 body라는 property 객체를 만들어 post로 전달된 data 에 접근할 수 있게 해준다
var bodyParser = require('body-parser');  //body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));

app.listen(3000, function(){  //app 이 가지는 listen 메서드 실행. 애플리케이션이 3000번 포트를 listening 하도록 함. callback function을 인자로 전달하고 listening 되었을 때 콜백함수가 실행될 수 있도록 함 -> 지금은 app listening 실행되었을 때 로그를 찍어 정상적으로 작동되는지를 알 수 있게 함
  console.log('Connected, 3000 port...!');
});

//이제 라우팅을 통해 적절한 링크에 따라 화면의 내용을 사용자에게 출력해줄 수 있도록 구성해보자.

// 라우팅 : 사용자의 요청을 적당한 컨트롤러와 연결하는 작업
app.get('/topic/new', function(req, res){
  // res.send('Hi'); //test
  res.render('new');  //new.jade 파일을 렌더링
});

//nodejs 에서 파일 제어하기 - file system module 사용
var fs = require('fs'); //nodejs 에서 파일 시스템 제어

//사용자가 전송한 데이터를 서버에서 받아 폴더에 파일(이름+내용)으로 저장하기
//현재 상태는 get 방식에 대한 코드가 없어 직접 /topic 주소를 입력해서 접속하는 경우 Cannot GET /topic 메세지가 출력됨(error)
app.post('/topic', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  //fs.writeFile(file, data[,options], callback)
  //asynchronously (1)writes data to a file, (2)replacing the file if it already exists. data can be a string or a buffer
  fs.writeFile('data/'+title, description, function(err){
  // fs.writeFile('dataa/'+title, description, function(err){  //error code
    if(err){
      // console.log(err); //error message 는 사용자에게 공개하지 않는다 ---> (보안) error에 대한 정보들이 해킹에 사용되는 단서가 될 수 있기 때문. 자세한 error reporting은 불특정에게 하지 않고 내부적으로 가지는 기밀 정보로서 유지. 이렇게 로그로 찍어서 개발자만 확인하도록 하는 방법.
      res.status(500).send('Internal Server Error');
    }
    res.send('Success!');
  });
});
