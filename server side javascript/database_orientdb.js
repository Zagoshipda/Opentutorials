var OrientDB = require('orientjs');

var server = OrientDB({ //db 연결
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: '5545'
});


var db = server.use('o2');  //사용할 db 설정

db.record.get('#1:1')
   .then(
      function(record){
         console.log('Loaded Record:', record);
       }
   );
