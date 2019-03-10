function nightDayHandler(self){
	var target = document.querySelector('body');	//get the body tag
	if(self.value === 'day'){	//change to night '==' is also available but...
		Body.setBackgroundColor('black');;	//set body tag's attributes
		Body.setColor('white');
		self.value = 'night';

		Links.setColor('powderblue');

	}else{	//if this.value === 'night'
		Body.setBackgroundColor('white');
		Body.setColor('black');
		self.value = 'day';

		Links.setColor('lightgreen');
	}
}

var Body = {
	setColor : function(color){
		document.querySelector('body').style.color = color;
	},	//object 의 property 사이는 , 로 구분해준다 
	setBackgroundColor : function(color){
		document.querySelector('body').style.backgroundColor = color;
	}
}

var Links = {
	setColor : function(color){	//parameter : argument as an input  
		var alist = document.querySelectorAll('a');
		var i = 0;
		while(i < alist.length){
			alist[i].style.color = color;
			i++;
		}
	}
}
