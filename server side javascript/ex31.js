// 31. GET vs POST 사용비교해보기

var express = require('express');
var app = express();  //express 함수를 실행하면 애플리케이션 객체가 반환되고 이를 app 변수에 저장
app.use(express.static('public'));
app.locals.pretty = true;
app.set('view engine', 'jade'); //the template engine to use
app.set('views', './views'); //the directory where the template files are located

//앞으로 이 애플리케이션으로 들어오는 모든 요청들은 body-parser middleware를 먼저 통과한 후에 route 가 동작하게 된다. 사용자의 요청이 들어오면 body-parser가 동작하면서 사용자가 POST 방식으로 전송한 data를 서버 측에서 사용할 수 있도록 바꾸어주는 작업을 수행.
var bodyParser = require('body-parser');  //post 방식을 위한 모듈
app.use(bodyParser.urlencoded({
  extended: false
}));

//form(1) 입력화면
app.get('/form', function(req, res){
  res.render('form'); //views directory의 template파일 (form.jade)을 load
});

// ***form(3) 입력버튼을 눌러 제출한 후 뜨는 화면을 POST 방식으로 구성하기
  // 2.form.jade 에서 form의 method='post'으로 설정하는 경우 (결국 form에서 data 전달방식을 설정하는 것이 우선적으로 중요함)
//post 방식에 대응하는 post 메서드 호출을 통해 이전 시간의 error 화면 문제해결
// body-parser : middleware, post 방식으로 전송한 데이터를 애플리케이션에서 사용할 수 있도록 해주는 (플러그인, 확장기능)
app.post('/form_receiver', function(req, res){
  var title = req.body.title; //body-parser가 없는 경우 error: Cannot read property 'title' of undefined. 현재 <req 객체 내부의 body 객체>가 존재하지 않아서 title이라는 값을 읽어올 수 없다는 의미.
  var description = req.body.description;
  res.send('Hello, POST...? : ' + title + ', ' + description);
  //body-parser를 설치하면 사용자가 POST 방식으로 전송한 데이터가 있다면 이 애플리케이션 안에서 <req 객체가 원래 가지고 있지 않았던 body 라는 객체를 추가하고> 사용자가 전송한 data 의 변수명에 따라 body 객체 내부에 대응하는 변수를 만들고 값을 집어넣는다. ex. title, description 값 등. 이에 따라 위 코드는 제대로 동작할 수 있게 된다.
});


// semantic(clean) URL 을 위한 routing 설정 -> req.params 사용
// app.get('/topic/:id', function(req, res){
app.get('/topic', function(req, res){
  var topics = [
    'JavaScript is...',
    'NodeJs is...',
    'Express is...'
  ];
  var output = `
    <a href="/topic?id=0">JavaScript</a><br>
    <a href="/topic?id=1">NodeJs</a><br>
    <a href="/topic?id=2">Express</a><br><br>
    ${topics[req.query.id]}
  `;
  // <a href="/topic/0">JavaScript</a><br>
  // <a href="/topic/1">NodeJs</a><br>
  // <a href="/topic/2">Express</a><br><br>
  // ${topics[req.params.id]}
  res.send(output);
});

// semantic(clean) URL example ---> restful API...?
app.get('/topic/:id/:mode', function(req, res){
  res.send(req.params.id+', '+req.params.mode);
});

app.get('/template', function(req, res){
  res.render('temp', {time: Date(), _title: 'Jade'});
});

// url 을 직접 치고 들어오는 것은 GET 방식의 접근이므로 get() 호출
// get -> 라우터 의 역할
app.get('/', function(req, res){
  res.send('Hello home page');
});

app.get('/route', function(req, res){
  res.send('Hello Router, <img src="/test.png">, <img src="/route.jpg">');  // height="42" width="42"
});

app.get('/login', function(req, res){
  res.send('<h1>Login please</h1>');
});

app.listen(3000, function(){  //애플리케이션 리스닝을 실시간으로 확인하기 위한 로그
  console.log('Connected 3000 port!');
});
