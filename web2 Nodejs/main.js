
//execute by http://localhost:3000/

var http = require('http');
var fs = require('fs');
var app = http.createServer(function(request,response){
    var url = request.url;
    if(request.url == '/'){
      url = '/index.html';
    }
    if(request.url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    // console.log(__dirname + url); //열리는 페이지 로그찍기
    response.end(fs.readFileSync(__dirname + url));

    //ctrl+c : stop node application

    // 아래 코드로 수정해야 한다고 했으나 오히려 아래가 실행이 안됨
    // response.writeHead(404);
    // response.end();
    // return;

});
app.listen(3000);
