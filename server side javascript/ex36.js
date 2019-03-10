//36. 웹 앱 제작 --- 글 목록 만들기 (본문 화면 구성하기) - 입력받아 저장하고 있는 정보들을 바탕으로 출력하기

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

app.get('/topic/new', function(req, res){
  res.render('new');  //new.jade 파일(사용자가 데이터를 입력해줄 form을 만드는 template 파일)을 렌더링
});


//36. 글 목록이 화면에 표시되도록 하기 -사용자가 직접 /topic 주소를 입력해서 접속하는 경우 화면에 표시할 내용 설정하기(아래 라우터를 설정하지 않으면 error 메세지 Cannot GET /topic이 뜬다)
// data 폴더 내부의 파일들의 목록을 가져와서 파일의 이름을 이용해 화면에 표시될 목록을 구성하도록 하자.
app.get('/topic', function(req, res){
  //fs.readdir(path, callback) data를 가져올 경로, data를 가져왔을 때 호출될 콜백감수. Asynchronous readdir. Reads the contents of a directory. the callback gets two arguments(err, files) where files is an array of te names of the files in the directory excluding '.' and '..'.
  //cf. fs.readdirSync(path) synchronous readdir. returns an array of filenames excluding '.' and '..'.
  fs.readdir('data', function(err, files){  //files 안에는 파일 제목이 배열로 들어 있다. -> 글 목록을 완성시키는 데 파일의 이름을 이용할 수 있다.
    if(err){  //에러가 있는 경우, 조건 자체로 err를 전달하여 조건확인
      console.log(err);
      res.status(500).send('Intenal Server Error');
    }
      res.render('view', {topics:files}); //render 메서드의 첫 번째 인자로는 렌더링할 jade 파일의 이름명이 들어온다(확장자 제외)- using view.jade template file, 두 번째 인자로는 해당 템플릿 파일 안으로 주입하려는 데이터를 객체 안에 담아서 전달한다. 위 선언은 view.jade 파일 내부에서 topics 라는 변수를 통해 files 라는 매개변수가 가지는 값들을 제어하겠다는 뜻이다
      // jade 파일에서는 반복문iteration을 사용하여 글 목록을 생성한다 -javascript 의 each iteration을 사용.
  });
});

// ** 그러나 아직까지는 data를 가져와서 글목록을 만들고 링크로 연결시켰을 뿐 해당하는 파일의 제목에 해당하는 파일의 본문을 가져와서 웹 페이지를 생성하고 사용자에게 보여주지(response 하지)는 못하므로 error메세지 Cannot GET /topic/javascript 가 화면에 나타남을 알 수 있다. 


//------------------------------------------------------------

//사용자가 전송한 데이터를 서버에서 받아 폴더에 파일(이름+내용)으로 저장하기
app.post('/topic', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title, description, function(err){
    if(err){
      console.log(err); //error message 는 사용자에게 공개하지 않는다 ---> (보안) error에 대한 정보들이 해킹에 사용되는 단서가 될 수 있기 때문. 자세한 error reporting은 내부적으로 가지는 기밀 정보로서 유지
      res.status(500).send('Internal Server Error');
    }
    res.send('Success!');
  });
});
