// Express js : 웹 페이지를 표현하는 방법 1.정적인 파일 전달 2.동적인 파일 전달

// 1.정적인 파일은 (html의)내용을 수정하면 (현재 애플리케이션 실행 상황에서 실시간으로)바로 해당하는 수정 내용을 반영시킬 수 있음
// 2.이에 비해 동적으로 파일의 내용을 전달하는 경우 node 애플리케이션을 종료하고 다시 실행해야 파일의 수정된 내용을 반영시킬 수 있음
// 그렇다면 두 가지 경우를 비교해본다면? 각각의 trade-off 를 생각해본다면 우선 (1)html로 코드를 짜는 경우가 (2)javascript로 코드를 짜는 것보다 간단하기는 하다. 그러나 html로는 하기 힘든 일이 있을 수 있다. 예를 들어 특정한 문장을 여러번 출력해야 한다면 (1)html로는 해당하는 횟수 만큼 코드를 입력해주어야 하지만 (2)동적으로, 프로그래밍적으로 웹 페이지를 만들어주는 경우는 for문으로 간단하게 처리할 수 있다. ---> 아래 coding 출력의 예시 확인. 또한 time의 예시와같이 html은 동적인 처리의 기능이없으므로 js의 라이브러리의 기능등을 사용해야 하는 경우도 (2)와 같은 동적인 처리가 필요하다 

var express = require('express'); //express module 사용하기
var app = express();  //express 함수를 실행하면 애플리케이션 객체가 반환되고 이를 app 변수에 저장... -> 객체변수...? java
app.use(express.static('public'));  //Now, you can load the files that are in the public directory

// 사용자 접속은 GET, POST 방식이 모두 가능
// url 을 직접 치고 들어오는 것은 GET 방식의 접근이므로 get() 호출
// get -> 라우터 의 역할.... 라우팅... 길을 찾는다 는 의미
app.get('/', function(req, res){
  res.send('Hello home page');
});

//동적인 내용 전달
app.get('/dynamic', function(req, res){ //template literal
  var lis = ''; //변수를 template literal 에 포함시킬 때는 ${} 사용
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
