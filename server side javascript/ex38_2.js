// 38. 웹 앱 제작 --- 코드의 개선
// 이번에는 지금까지의 코드 내용에서 중복되는 내용들을 제거해보자.

// (1) /topic 과 /topic/:id 를 구분해놓은 것 -> 그러나 콜백 함수 내부의 동작방식이 비슷하므로 코드가 비슷하다 (ex38_2.js) -> id 존재여부에 따라 조건문으로 나누어서 처리
// (2) home url link 를 추가 -> 제목을 클릭하면 이동할 수 있도록 (view.jade) -> 제목에 하이퍼링크 태그 추가
// (3) 항목추가 페이지로 이동할 수 있는 링크 추가하기 (view.jade) -> new 하이퍼링크 태그 추가
// (4) 항목추가를 위해 new 링크를 클릭하면 새로운 창에서 열리는 new.jade 파일이 화면이 사용자에게는 동떨어진다는 느낌을 줄 수 있음 -> 파일 리스트는 계속해서 보여줄 수 있도록 new.jade에도 view.jade에 있는 태그들을 옮겨서 적용한다. (new.jade, ex38_2.js) -> 이를 위해서는 기존에 new.jade template을 그대로 render 하던 '/topic/new' 라우터에 변화를 주어야 하는데, 즉 new.jade에 있는 topics 변수로 값을 전달해주어야 한다. 그리고 그 때 전달해주어야 하는 값은 data폴더 내부에 있는 파일들의 이름 목록을 담은 배열의 형태이다 -> fs.readdir, files 변수를 사용
// (5) /topic/new 에서 submit 을 했을 때 response로 Success메세지가 화면에 출력되는 것을 실제 서비스와 같이 개선해보자 -> 새로 작성한 data를 출력하는 페이지로 연결시키자. 사용자가 글을 제대로 작성했는지를 확인할 수 있는 방법으로는 해당 data를 담고 있는 페이지를 만들어서 보여주면 된다 -> Redirection

// 위 작업들은 페이지들 사이의 통일성을 갖추기 위한 작업이라 할 수 있고, 이는 실제로 사용자와의 소통에 매우 중요한 부분임(이 될 수 있음)을 명심하자 ~ UX design
// 실제로는 파일에 data를 저장하고 관리하는 것이 아닌 database 라는 전문적인 software를 사용함을 생각하자. 



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

// routings....

// make a new item to the list
app.get('/topic/new', function(req, res){
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error...');
    }
    res.render('new', {topics:files});
  });
});

  // app.get('/topic/new', function(req, res){
  //   res.render('new');  //new.jade 파일(사용자가 데이터를 입력해줄 form을 만드는 template 파일)을 렌더링
  // });


// 아래 (a)와 (b)를 합친 것 -> url 을 배열의 형태로 받을 수 있으므로 2가지 경우를 합칠 수 있다
app.get(['/topic', '/topic/:id'], function(req, res){
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Intenal Server Error');
    }
    var id = req.params.id;
    if(id){
      fs.readFile('data/'+id, 'utf8', function(err, data){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        res.render('view', {topics:files, title: id, description:data});
      }); //end of readFile
    }else{  //id 값이 없는 경우 NULL 이나 undefined 인데 javascript 는 이를 false로 취급하므로 id가 없는 경우, 즉 home url 인 경우 아래가 실행된다.
      res.render('view', {topics:files, title:'Welcome', description:'Hello javascript for server...!'});
    }
  }); //end of readdir
});


  // // (a)home url
  // app.get('/topic', function(req, res){
  //   fs.readdir('data', function(err, files){  //files is an array of te names of the files in the directory
  //     if(err){
  //       console.log(err);
  //       res.status(500).send('Intenal Server Error');
  //     }
  //     res.render('view', {topics:files});
  //   });
  // });
  //
  // // (b)파일의 본문내용 읽기
  // app.get('/topic/:id', function(req, res){
  //   var id = req.params.id;
  //   fs.readdir('data', function(err, files){
  //     if(err){
  //       console.log(err);
  //       res.status(500).send('Internal Server Error');
  //     }
  //     //the data is the contents of the file
  //     fs.readFile('data/'+id, 'utf8', function(err, data){
  //       if(err){
  //         console.log(err);
  //         res.status(500).send('Internal Server Error');
  //       }
  //       // html file ->  render a jade template file
  //       res.render('view', {topics:files, title: id, description:data});
  //     }); //end of readFile
  //   }); //end of readdir
  // });


//사용자가 전송한 데이터를 서버에서 받아 폴더에 파일(제목+내용)으로 저장하기
app.post('/topic', function(req, res){
  //body-parser의 도움을 받아 data 받아 가져오기
  var title = req.body.title;
  var description = req.body.description;
  // Asynchronously writes data to a file, replacing the file if it already exists.
  fs.writeFile('data/'+title, description, function(err){
    if(err){
      console.log(err); //error message is confidential
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic/'+title);  //새롭게 작성한 data url로 바로 이동. redirect의 인자로는 사용자를 보낼 url을 전달한다.
    // res.send('Success!');  //단순 메세지 출력
  });
});
