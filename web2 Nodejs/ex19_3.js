//ex19(2). home page 구현하기
//execute by http://localhost:3000/

var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){ //제대로 동작하는 경우
      if(queryData.id === undefined){  //home url인 경우
          var title = 'Welcome';    //home page의 문구 설정하기 ---> home page의 정보는 fileread가 필요없음
          var description = 'Hello, Node.js';
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ul>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ul>
            <h2>${title}</h2>
            <p>
            ${description}
            </p>
          </body>
          </html>
          `;
          response.writeHead(200);  //성공적 전송
          response.end(template);
      } else {  //home url이 아닌 url 의 경우
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ul>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ul>
            <h2>${title}</h2>
            <p>
            ${description}
            </p>
          </body>
          </html>
          `;
          response.writeHead(200);  //성공적 전송
          response.end(template);
        });
      }
    } else {  //에러가 발생하는 경우
      response.writeHead(404);  //전송 실패
      response.end('Not found');
    }


});
app.listen(3000);
