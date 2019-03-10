var express = require('express'); //express module 사용하기
var app = express();  //express 는 함수이다 !!! 함수를 실행하면 애플리케이션 객체가 반환되고 이를 app 변수에 저장

//사용자 접속은 GET, POST 방식이 모두 가능
// url 을 직접 치고 들어오는 것은 GET 방식의 접근이므로 get() 호출
app.get('/', function(req, res){  // '/'의 의미 : home page 로 접속하는 경우, callback function
  res.send('Hello home page'); //res 객체에 메세지 전달
});

//get -> 라우터 의 역할.... 라우팅... 길을 찾는다 는 의미
app.get('/login', function(req, res){ //user 가 로그인 페이지에 접속하는 경우
  res.send('Login please');
  //res.send('<h1>Login please</h1>');  //html 태그까지도 전달 가능
});

app.listen(3000, function(){  //port 번호 지정하기  --- listening on 3000 port
  console.log('Connected 3000 port!');
});

//Cannot GET / 출력됨 ---일종의 에러  title: Error 임을 확인할 수 있음
