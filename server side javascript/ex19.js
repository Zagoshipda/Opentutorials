// Express js : 정적 파일을 서비스하는 법

var express = require('express'); //express module 사용하기
var app = express();  //express 는 함수이다 !!! 함수를 실행하면 애플리케이션 객체가 반환되고 이를 app 변수에 저장

app.use(express.static('public'));  //public 폴더를 루트 파일로 지정하는 역할
//serve images, CSS files, and JavaScript files in a directory named public. Now, you can load the files that are in the public directory
// Express looks up the files relative to the static directory, so the name of the static directory is not part of the URL.

//사용자 접속은 GET, POST 방식이 모두 가능
// url 을 직접 치고 들어오는 것은 GET 방식의 접근이므로 get() 호출
app.get('/', function(req, res){
  res.send('Hello home page'); //res 객체에 메세지 전달
});

// txt 파일을 여는 방법 : http://localhost:3000/test.txt
// http://localhost:3000/route.jpg, http://localhost:3000/test.png

app.get('/route', function(req, res){
  // 이미지 크기 지정가능 height="42" width="42"
  res.send('Hello Router, <img src="/test.png">'); //res 객체에 메세지 전달
});
//get -> 라우터 의 역할.... 라우팅... 길을 찾는다 는 의미
app.get('/login', function(req, res){ //user 가 로그인 페이지에 접속하는 경우
  res.send('<h1>Login please</h1>');
});

app.listen(3000, function(){
  console.log('Connected 3000 port!');
});
