
//execute by http://localhost:3000/

var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    console.log(queryData); //변수값을 알아보기 위한 로그 : 객체 { id: 'HTML' }가 출력됨 
    if(_url == '/'){
      _url = '/index.html';
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    // console.log(__dirname + _url); //열리는 페이지 로그찍기
    response.end(fs.readFileSync(__dirname + _url));

    //ctrl+c : stop node application

});
app.listen(3000);
