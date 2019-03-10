//38. 웹 앱 제작 --- 코드의 개선
//아래 소스코드는 일단 지금까지의 코드 중 필수적으로 알아야 할 주석들만 남기고 대략적으로 정리한 것.
// 코드를 개선한 내용은 ex38_2.js 에서 확인할 수 있음

//Express: web framework for Node.js
var express = require('express'); //node_modules 에 있는 express 모듈 추가
var app = express();  //애플리케이션 객체 만들기. express 함수 실행. 리턴하는 애플리케이션 객체를 app 변수로 제어
var fs = require('fs'); //nodejs 에서 파일 시스템 제어

app.set('views', './views_file'); //template files from, views_file
app.set('view engine', 'jade'); //template engine 으로 jade를 사용
app.locals.pretty = true; //view page source - jade template file을 기반으로 만들어진 html을 더 보기 좋게 바꾸어주기

var bodyParser = require('body-parser'); //post 방식으로 전달된 데이터 받아서 사용하기 -> body parser middleware 필요
app.use(bodyParser.urlencoded({extended: false}));

app.listen(3000, function(){  //listening on localhost:3000
  console.log('Connected, 3000 port...!');
});

// 라우팅 : 사용자의 요청을 적당한 컨트롤러와 연결하는 작업


// 새로운 항목 만들기
app.get('/topic/new', function(req, res){
  res.render('new');  //new.jade 파일(사용자가 데이터를 입력해줄 form을 만드는 template 파일)을 렌더링
});

// 메인 화면 home url
app.get('/topic', function(req, res){
  //fs.readdir(path, callback) Asynchronous readdir. Reads the contents of a directory. the callback gets two arguments(err, files) where <<files is an array of te names of the files in the directory>> excluding '.' and '..'.
  //readdir -> 경로를 따라 읽어가서 파일 제목 가져오기
  fs.readdir('data', function(err, files){  //files 안에는 파일 제목이 배열로 들어 있다.
    if(err){
      console.log(err);
      res.status(500).send('Intenal Server Error');
    }
      res.render('view', {topics:files}); //using view.jade template file, 두 번째 인자로는 해당 템플릿 파일 안으로 주입하려는 데이터를 객체의 형식으로 전달. 위 선언은 view.jade 파일 내부에서 topics 라는 변수를 통해 files 라는 매개변수가 가지는 값들을 받아서 제어하겠다는 뜻
  });
});


//본문읽기 -> 이제부터 파일의 본문내용을 가져와보자 -------------------

app.get('/topic/:id', function(req, res){ //clean url 방식 (RESTful URLs, user-friendly URLs, or search engine-friendly URLs...)
  var id = req.params.id;
  //readdir 이 우선 필요한 이유는 view template 파일을 rendering 할 때 topics 와 title 변수 2가지가 모두 필요하기 때문.
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    // read (1)dir-파일이름 (2)File-파일 그 자체를 읽어서 그 내용을 가져옴
    // Asynchronously <<reads the entire contents of a file. the data is the contents of the file>>
    fs.readFile('data/'+id, 'utf8', function(err, data){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }

      // html 파일이 필요 ->  render a jade template file
      res.render('view', {topics:files, title: id, description:data});
    }); //end of readFile
  }); //end of readdir
});


//사용자가 전송한 데이터를 서버에서 받아 폴더에 파일(제목+내용)으로 저장하기
app.post('/topic', function(req, res){
  //body-parser의 도움을 받아 data 받아 가져오기
  var title = req.body.title;
  var description = req.body.description;
  //fs.writeFile(file, data[,options], callback) :: file<String>-filename or a file descriptor, data<String>, callback<Function>-err<Error>
  // Asynchronously writes data to a file, replacing the file if it already exists.
  fs.writeFile('data/'+title, description, function(err){
    if(err){
      console.log(err); //error message 는 사용자에게 공개하지 않는다 ---> (보안) error에 대한 정보들이 해킹에 사용되는 단서가 될 수 있기 때문. 자세한 error reporting은 내부적으로 가지는 기밀 정보로서 유지
      res.status(500).send('Internal Server Error');
    }
    res.send('Success!');
  });
});
