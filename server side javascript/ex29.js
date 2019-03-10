// 29. POST방식을 이용한 정보전달 : form 사용하기 ---사용자의 응답, 입력값 받기
// html 에서 form 은 일종의 url을 자동으로 생성해주는 일종의 program, logic 이라고 볼 수 있다
// form 태그에 method를 생략하면 기본값으로 method="get"로 인식한다.
// post방식은 직접 지정 method="post"한다. 그리고 이때는 query string 이 url에 표시되지 않는다

var express = require('express');
var app = express();  //express 함수를 실행하면 애플리케이션 객체가 반환되고 이를 app 변수에 저장
app.use(express.static('public'));
app.locals.pretty = true;
app.set('view engine', 'jade'); //the template engine to use
app.set('views', './views'); //the directory where the template files are located

// ---------------------------------------------------------------

// form(1) 입력화면
app.get('/form', function(req, res){
  res.render('form'); //views directory의 template파일 (form.jade)을 load
});

// *** form(2) 입력버튼을 눌러 제출한 후 뜨는 화면
//form_receiver ---> jade 파일에서 정의한 경로 인 /form_receiver를 그대로 따라간다
//아직까지는 query string은 url에서 사라졌지만 Cannot POST /form_receiver 가 화면에 출력된다 ...->이유는? 정보전송에 실패한 것? 아니다. 제출한 정보들은 서버로 전송된 상태이지만, 정보 전송 방식이 POST 이면 url을 통해 data를 전송하는 것이 아닌 눈에 보이지 않는 방식으로 data를 전달하기 때문에 화면으로 그 내용을 출력하지 않은 것.
app.get('/form_receiver', function(req, res){
  var title = req.query.title;
  var description = req.query.description;
  res.send(title + ', ' + description);
});

// ---------------------------------------------------------------


// semantic(clean) URL 을 위한 routing 설정 -> req.params 사용
app.get('/topic/:id', function(req, res){ //익명함수, callback, req, res객체
  var topics = [
    'JavaScript is...',
    'NodeJs is...',
    'Express is...'
  ];
  var output = `
    <a href="/topic/0">JavaScript</a><br>
    <a href="/topic/1">NodeJs</a><br>
    <a href="/topic/2">Express</a><br><br>
    ${topics[req.params.id]}
  `;
  // 쿼리스트링 방식인 req.query.id를 그대로 두면 undefined가 출력됨
  res.send(output);
});

// semantic(clean) URL example ---> restful API...??
app.get('/topic/:id/:mode', function(req, res){
  res.send(req.params.id+', '+req.params.mode);
});


app.get('/template', function(req, res){
  res.render('temp', {time: Date(), _title: 'Jade'}); //views 폴더 내부의 tmep.jade 파일과 연동
});

// url 을 직접 치고 들어오는 것은 GET 방식의 접근이므로 get() 호출
// get -> 라우터 의 역할
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
