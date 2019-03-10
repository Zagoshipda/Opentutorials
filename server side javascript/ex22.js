// 22. Express, template engine, how to use

var express = require('express');
var app = express();  //express 함수를 실행하면 애플리케이션 객체가 반환되고 이를 app 변수에 저장... -> 객체변수...? java
app.use(express.static('public'));

app.locals.pretty = true; //코드를 보기 좋게 하기 위함... tab 간격을 자동으로 정리해준다
app.set('view engine', 'jade'); //the template engine to use
app.set('views', './views'); //the directory where the template files are located

app.get('/template', function(req, res){
  res.render('temp', {time: Date(), _title: 'Jade'}); //views directory에서 temp파일을 찾고 그 내용을 출력
});

// 사용자 접속은 GET, POST 방식이 모두 가능
// url 을 직접 치고 들어오는 것은 GET 방식의 접근이므로 get() 호출
// get -> 라우터 의 역할.... 라우팅... 길을 찾는다 는 의미
app.get('/', function(req, res){
  res.send('Hello home page');
});

app.get('/dynamic', function(req, res){ //template literal
  var lis = '';
  for(var i=0; i<5; i++){
    lis = lis + '<li>coding</li>';
  }
  var time = Date();
  var output = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Document</title>
  </head>
  <body>
    Hello, Dynamic...! (2)
    ${lis}
    ${time}
  </body>
  </html>`;
  res.send(output); //위 html 코드의 내용을 response 객체에 전달한다
});

app.get('/route', function(req, res){
  res.send('Hello Router, <img src="/test.png">, <img src="/route.jpg">');  // height="42" width="42"
});

app.get('/login', function(req, res){
  res.send('<h1>Login please</h1>');
});

app.listen(3000, function(){
  console.log('Connected 3000 port!');
});
