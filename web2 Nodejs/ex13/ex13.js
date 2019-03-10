//ex13. query string의 값에 따라서 본문이 변경되는 웹 애플리케이션 만들기


//execute by http://localhost:3000/

var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;

    console.log(queryData.id); //변수값을 알아보기 위한 로그 : 객체 { id: 'HTML' }가 출력됨
    if(_url == '/'){
      title = 'Welcome';
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);

    // 이제부터 description의 내용은 수정하는 즉시마다 그 내용이 반영되어서 화면에 출력된다 el? jstl?
    fs.readFile(`${queryData.id}`, 'utf8', function(err, description){
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
      response.end(template);
    });

});
app.listen(3000);
