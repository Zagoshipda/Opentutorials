
// The <<process.argv property returns an array>> containing the command line arguments passed when the Node.js process was launched.
// The first element will be process.execPath, The second element will be the path to the JavaScript file being executed. The remaining elements will be any additional command line arguments.

var args = process.argv;
console.log(args);  //배열(array)의 형식으로 출력
console.log("A");
console.log("B");
if(args[2] === '1'){  //입력값이 1 인 경우 출력 
  console.log("C1");
}else {
  console.log("C2");
}
console.log("D");
