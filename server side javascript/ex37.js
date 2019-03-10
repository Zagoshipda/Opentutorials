//37. 웹 앱 제작 --- 본문 읽기 (제목에 해당하는 파일의 본문내용 가져와서 출력하기)

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

app.get('/topic', function(req, res){
  //fs.readdir(path, callback) Asynchronous readdir. Reads the contents of a directory. the callback gets two arguments(err, files) where files is an array of te names of the files in the directory excluding '.' and '..'. -> 비동기적 방식이므로 변수를 하나 만들고 거기에 결과값을 저장해서 전달하는 방식을 채택
  //cf. fs.readdirSync(path) synchronous readdir. returns an array of filenames excluding '.' and '..'. -> 동기적 방식이므로 그냥 메서드 자체가 결과값을 리턴하는 방식
  fs.readdir('data', function(err, files){  //files 안에는 파일 제목이 배열로 들어 있다. -> 글 목록을 완성시키는 데 파일의 이름을 이용
    if(err){
      console.log(err);
      res.status(500).send('Intenal Server Error');
    }
      res.render('view', {topics:files}); //using view.jade template file, 두 번째 인자로는 해당 템플릿 파일 안으로 주입하려는 데이터를 객체 안에 담아서 전달한다. 위 선언은 view.jade 파일 내부에서 topics 라는 변수를 통해 files 라는 매개변수가 가지는 값들을 제어하겠다는 뜻
  });
});

// ** 그러나 아직까지는 data를 가져와서 글목록을 만들고 링크로 연결시켰을 뿐, 해당하는 파일의 제목에 해당하는 파일의 본문 내용까지를 가져와서 웹 페이지를 생성하고 사용자에게 보여주지(response 하지)는 못하므로, error메세지 Cannot GET /topic/javascript 가 화면에 나타남을 알 수 있다.



//37.본문읽기 -> 이제부터 파일의 본문내용을 가져와보자 -------------------

app.get('/topic/:id', function(req, res){ //clean url 방식 (RESTful URLs, user-friendly URLs, or search engine-friendly URLs...)

  var id = req.params.id;
  // res.send(id);  //for debugging

  //readdir 이 우선 필요한 이유는 view template 파일을 rendering 할 때 topics 와 title 변수 2가지가 모두 필요하기 때문. files가 파일 제목들을 원소로 가지고 있는 배열이므로 배열 변수를 따로 하나 만들어서 값을 복사해서 저장했다가 나중에 사용하는 방법도 일단 원리적으로는 가능할 것 같긴한데 그것이 실제로도 javascript 기능에 따라 가능한방법인지, 가능하다면 어느 방법이 더 좋은방법인지도 잘 모르겠고, 배열을 선언해서 구현하는 문법에 대해서도 일단 구체적으로 모르기 때문에 일단은 이렇게 해보자.
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }

    // var id = req.params.id; // TEST : id 를 여기서 선언해도 되는지...?? --> 된다....!! 결론- 더 넓은 범위의 scope 에서 선언되어 있는 req객체는 그보다 안쪽에 위치한 funciton 에서도 사용이 가능하다.

    //그러면 id값에 해당하는 제목을 가진 파일의 본문을 읽어오자.
    //fs.readFile(file[,options], callback) :: file<String>-filename or file descriptor, callback<Function>-err<Error>, data<String> - Asynchronously <<reads the entire contents of a file. the data is the contents of the file>>
    fs.readFile('data/'+id, 'utf8', function(err, data){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      // res.send(data); //debugging
      // 그런데 단순히 데이터만 홀로 보여주는 것이 UX 부분에서 좋지 않으므로 기존 창에 보여지던 정보들을 그대로 보여주면서 클릭한 글의 제목에 대응하는 본문내용을 아래쪽에 보여주기를 원한다고 해보자. 그렇다면 결국 어떠한 html 파일이 필요할 것인데, 그렇다면 결국 render 메서드를 통해 jade template 파일을 이용하는 것이 지금 사용할 수 있는 방법임을 알 수 있다.
      res.render('view', {topics:files, title: id, description:data});
    }); //end of readFile
  }); //end of readdir
});


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
