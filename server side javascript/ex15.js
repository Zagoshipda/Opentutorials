// express 도입 :: node를 이용해서 만들어진 framework
// ***shift 키를 누른 상태에서 스크롤하면 tab을 scroll 할 수 있다

const http = require('http'); //require function, http module을 가져온다
const hostname = '127.0.0.1'; //localhost
const port = 1337;  //set port number for server listening

//http module

// http.createServer((req, res) => {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(port, hostname, () => { //createServer class의 listen 메서드 실행,  callback
//   console.log(`Server running at http://${hostname}:${port}/`); //console 에 주소창을 알려주는 로그 찍기 template literal
// });

// *** 위 코드는 아래와 동작방식이 같다...ex4.js 와 비교하기

// listening 이 성립된 경우, 서버가 listening 하고 있던 포트로 사용자가 실제로 접속했을 때, 웹 서버가 어떤 내용을 출력할 것인지. 어떤 응답을 사용자에게 되돌려주는지.를 설정하기 위해 서버를 생성할 때 사용한 createServer 메서드의 인자값으로 해당 내용을 전달하도록 한다. 전달은 익명함수를 사용한다.
//  callback function을 createServer메서드의 '인자 값'으로 익명함수의 형태로 전달한다 ~ js 에서는 함수는 값으로서 다양하게 활용될 수 있음
// listening 의 결과로서 createServer 메서드 내의 내용을 전달하는 것이므로 소통과정에서의 요청, 응답 정보를 담고 있는 req, res 객체를 함수의 인자로서 전달하도록 한다.
var server = http.createServer(function(req, res){  //여기도 callback function, 비동기적 실행
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World... this is ex15\n'); //응답으로 보낼 메세지 
}); //createServer method returns a new instance of http.Server(Class)... createServer에 의해 객체가 return 된다

//서버를 만들고 특정 포트를 listening 하게 만든다. 어떤 IP를 가진 사용자의 응답을 받을 것인지를 식별하기 위해 hostname변수를 전달
// listening 작업은 시간이 걸릴 수도 있는 작업 -> 비동기적 실행으로 처리, listen 메서드 비동기적으로 작동한다,  listening 이 완료되었을 때 callback function이 실행되도록 약속되어 있는 것.
server.listen(port, hostname, function(){   //callback function -> 비동기적으로 작동함을 의미한다 ... 시간의 효율성을 위해 동작하도록 설게한다는 것
  console.log(`Server running at http://${hostname}:${port}/`);
});
