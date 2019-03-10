var _ = require('underscore');  //underscore 는 _를 변수로 사용하는 convention이 있다.




//practices from https://github.com/indongyoo/functional-javascript/wiki/3.1-Underscore.js-%EC%86%8C%EA%B0%9C

// _.each([1,2,3], function(val, idx, list){
//   console.log(val, idx, list);
// });

[1, 2, 3].forEach(function(val, idx, list) { console.log(val, idx, list); });
// 1 0 [1, 2, 3]
// 2 1 [1, 2, 3]
// 3 2 [1, 2, 3]

_.each({ a: 1, b: 2 }, function(val, key, obj) { console.log(val, key, obj); });
// 1 "a" {a: 1, b: 2}
// 2 "b" {a: 1, b: 2}
