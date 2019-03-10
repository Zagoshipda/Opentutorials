//ex19(1). not found 구현하기
//execute by http://localhost:3000/

var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;

    console.log(url.parse(_url, true)); //각종 url 정보들에 대한 로그 ---> fabicon.ico 가 나오는 경우는 언제인지에 대해 알아보기.... 처음에는 원래 url의 id값과 같이 fabicon.ico 값이 같이 나오다가 조금 하다보니 더 이상 나오지 않음... 왜일까

    if(pathname === '/'){ //제대로 동작하는 경우
    //   if(queryData.id == undefined){  //home url인 경우
    //
    //   } else {  //home url이 아닌 경우
    //
    //   }
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
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
    } else {  //에러가 발생하는 경우
      response.writeHead(404);  //전송 실패
      response.end('Not found');  // not found
    }



});
app.listen(3000);
