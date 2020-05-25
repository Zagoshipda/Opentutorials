var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());  // cookie-parser middleware

// data
var products = {
  1:{title:'The history of web 1'},
  2:{title:'The next web'}
};

app.get('/products', function(req, res){
  var output = '';
  for(var name in products){
    output += `
      <li>
        <a href="/cart/${name}">${products[name].title}</a>
      </li>
    `;
  }
  res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">go to Cart</a>`);
});

/*
cart = {
  1:2,
  2:5
}
*/
app.get('/cart/:id', function(req, res){
  var id = req.params.id;
  var cart;
  if(req.cookies.cart){
    cart = req.cookies.cart;
  }
  else {
    cart = {};
  }
  if(!cart[id]){
    cart[id] = 0;
  }
  cart[id] = parseInt(cart[id]) + 1;
  res.cookie('cart', cart);
  // res.send(cart);
  res.redirect('/cart');
});

app.get('/cart', function(req, res) {
  var cart = req.cookies.cart;
  if(!cart){
    res.send('Cart is now empty!');
  }
  else {
    var output;
    for(var id in cart){
      output += `<li>${products[id].title} : (${cart[id]}) 개</li>`;
    }
  }
  res.send(`
    <h1>Cart</h1>
    <ul>${output}</ul>
    <a href="/products">Products List</a>
  `);
});

app.get('/count', function(req, res){
  var count;
  if(req.cookies.count){
    count = parseInt(req.cookies.count);
  }
  else {
    count = 0;
  }
  count = count + 1;
  res.cookie('count', count);
  res.send('count : ' + count);
});

app.listen(3003, function(){
  console.log('Connected 3003 port...!');
});
