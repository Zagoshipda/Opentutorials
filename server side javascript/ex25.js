// 25. URL을 이용한 정보의 전달, query 객체 사용
// 27. semantic(clean) URL(uniform resource locator)

var express = require('express');
var app = express();  //express 함수를 실행하면 애플리케이션 객체가 반환되고 이를 app 변수에 저장... -> 객체변수...? java
app.use(express.static('public'));
app.locals.pretty = true;
app.set('view engine', 'jade'); //the template engine to use
app.set('views', './views'); //the directory where the template files are located

//query string, 웹 페이지를 프로그래밍적으로 생성하기
//req의 query property (req객체가 가지는 또다른 객체)
//req.query: an object containing a property for each query string parameter in the route. If there is no query string, it is the empty object, {}
app.get('/topic', function(req, res){ //익명함수, callback, req, res는 객체
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
  // output = output + topics[req.query.id];
  res.send(output);
});

// semantic(clean) URL 을 위한 routing 설정
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
  // req.query.id를 그대로 두면 undefined가 출력됨
  res.send(output);
});

// semantic(clean) URL example ---> restful API
app.get('/topic/:id/:mode', function(req, res){
  res.send(req.params.id+', '+req.params.mode);
});


//...??? data 출력하기 (강의 내용은 아니지만 코드 존재)
app.get('/param/:module_id/:topic_id', function(req, res){
  //res.json: Sends a JSON response. This method sends a response (with the correct content-type) that is the parameter converted to a JSON string. you can also use it to convert other values to JSON.
  //req.params: an object containing properties mapped to the named route “parameters”. This object defaults to {}
  // res.json(req.params);
  var output = req.params;
  // var output2 = req.query;
  res.send(output); //output2로 바꿔서 테스트해보기
  // res.json(req.params.module_id);
});

// req.param 과 req.query의 차이 확인해보는 예제
//http://localhost:3000/diff?id=1&name=e
app.get('/diff', function(req, res){
  res.send(req.params.id+', '+req.params.mode); //undefined
  // res.send(req.query.id+', '+req.query.mode);  //1, e
});


app.get('/template', function(req, res){
  res.render('temp', {time: Date(), _title: 'Jade'});
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
