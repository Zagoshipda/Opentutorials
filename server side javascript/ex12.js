// JavaScript - callback function
// javascript 는 함수를 인자로도 전달할 수 있다...!! 콜백함수는 인자로 전달되는 함수라 보아도 무방..

//case#1
a = [3,1,2];
function b(v1, v2){
  console.log(v1, v2);
  return 0;
}
a.sort(b);  //function b 를 sorting function 으로 전달하고 sorting 과정에서 3 1 \n 1 2 가 출력
console.log(a);   // [3, 1, 2] 물론 위의 sorting function은 단순히 값들을 출력하는 작업만 하기 때문에 배열 a 의 원소들의 순서에는 영향을 주지 않고 처음 원소들의 순서 그대로 출력된다.

//case#2
a.sort(function(v1, v2){  //이번에는 원래 sorting function 과 sorting 의 순서가 정반대인 function을 인자로 전달하여 sorting 을 진행한다
  return v2-v1;
});
console.log(a); // [3, 2, 1] sorting 한 결과 원소들의 배열이 정렬된 순서로 출력되는 것을 확인할 수 있다

//case#3
function sort(callback){  //인자로 funciton을 전달 
  callback(); //인자로 전달한 함수를 그대로 호출한다
}
sort(function(){  //전달한 function 이 실행되면서 log 안의 내용 출력
  console.log('Hello Callback');
});
