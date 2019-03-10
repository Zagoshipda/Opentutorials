var testFolder = './data';  // ./은 현재 디렉토리를 의미한다.
var fs = require('fs');

fs.readdir(testFolder, function(error, filelist){
  console.log(filelist);  //data폴더 안의 파일들의 목록이 배열로 출력됨
});
