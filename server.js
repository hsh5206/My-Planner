const express = require('express');
const app = express();

const server = app.listen(3000, () =>{
  console.log('start server: localhost:3000');
});

app.set('views', __dirname + '/');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.get('/', function (req, res){
  res.render('index.html');
});

