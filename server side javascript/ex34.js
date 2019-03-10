//34 웹 앱 제작 --- 새로운 프로젝트 : 라우팅 (파일 기반 data저장)

var express = require('express'); //node_modules 에 있는 express 모듈 추가
var app = express();  //애플리케이션 객체 만들기. express 함수 실행. 리턴하는 애플리케이션 객체를 app 변수로 제어
app.set('views', './views_file'); //여러 template file 들의 root directory를 views_file 로 지정
app.set('view engine', 'jade'); //template engine 으로 jade를 사용하겠음

app.listen(3000, function(){  //app 이 가지는 listen 메서드 실행. 애플리케이션이 3000번 포트를 listening 하도록 함. callback function을 인자로 전달하고 listening 되었을 때 콜백함수가 실행될 수 있도록 함.
  console.log('Connected, 3000 port...!');
});

//이제 라우팅을 통해 적절한 링크에 따라 화면의 내용을 사용자에게 출력해줄 수 있도록 구성해보자.

// 라우팅 : 사용자의 요청을 적당한 컨트롤러와 연결하는 작업
app.get('/topic/new', function(req, res){
  // res.send('Hi'); //test
  res.render('new');  //views_file 폴더 안의 new.jade 파일을 렌더링
});

//우선 new.jade에서 form 태그에서 post방식으로 정보를 전송했으므로 post 방식으로 들어온 정보를 받아들일 라우터를 설정한다.
app.post('/topic', function(req, res){
  res.send('Success!');
});
