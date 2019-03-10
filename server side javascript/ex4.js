
// example : nodejs가 server 에서 들어온 요청에 응답하는 애플리케이션을 만들 수 있는 기반을 제공함을 보여주는 예제

const http = require('http'); //require function, http module을 가져온다
const hostname = '127.0.0.1'; //localhost
const port = 1337;  //set port number for server listening

//http module
//createServer returns a new instance of http.Server(Class)
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(port, hostname, () => { //createServer class의 listen 메서드 실행,  callback
  console.log(`Server running at http://${hostname}:${port}/`); //console 에 로그 찍기
});
