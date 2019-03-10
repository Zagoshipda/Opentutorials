var fs = require('fs');
// fs.readFile('ex12/sample.txt', 'utf8', function(err, data){
  fs.readFile('./sample.txt', 'utf8', function(err, data){  //이 둘의 차이점 알아보기
  console.log(data);
});


//readFile과 readFileSync의 차이점 알아보기
