//practice of template literal (리터럴)


// \n 은 줄바꿈으로 인식한다

var name = "김병연";
var letter = 'Dear '+ name + '\n\n blahblah. '+ name + ' sth.... '+ name;
console.log(letter);


//template literal

var letter2 = `Dear ${name}

 blahblah. ${name} sth.... ${name}`;
console.log(letter2);
