//execute by http://localhost:3000/

var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){ //제대로 동작하는 경우
      if(queryData.id == undefined){  //home url인 경우
        fs.readdir('./data', function(error, filelist){ //파일목록 가져오기
          // console.log(filelist);  //filelist 변수에 파일목록이 저장된 것 확인하기
          var title = 'Welcome';      // home page의 문구 설정
          var description = "Hello, Node.js";

          // var list = `
          // <ul>
          //   <li><a href="/?id=HTML">HTML</a></li>
          //   <li><a href="/?id=CSS">CSS</a></li>
          //   <li><a href="/?id=JavaScript">JavaScript</a></li>
          // </ul>`;
          var list = '<ul>';  //list를 프로그래밍적으로 생성하기
          var i = 0;
          while(i < filelist.length){
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i++;
          }
          list = list + '</ul>';
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>
            ${description}
            </p>
          </body>
          </html>
          `;
          response.writeHead(200);  //성공적 전송
          response.end(template);
        }); //end of readdir
      } else {  //home url이 아닌 url 의 경우
        fs.readdir('./data', function(error, filelist){

          var list = '<ul>';
          var i = 0;
          while(i < filelist.length){
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i++;
          }
          list = list + '</ul>';

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
              ${list}
              <h2>${title}</h2>
              <p>
              ${description}
              </p>
            </body>
            </html>
            `;
            response.writeHead(200);  //성공적 전송
            response.end(template);
          }); //end of readfile
        });   //end of readdir
      }
    } else {  //에러가 발생하는 경우
      response.writeHead(404);  //전송 실패
      response.end('Not found');
    }



});
app.listen(3000);
