var express = require('express');
var path = require('path');

var app = express();

app.use(express.static('client'));
app.use('/node_modules', express.static('node_modules'));

app.all('/*', function(req, res) {
  res.sendFile(path.resolve('client/index.html'));
});

app.listen(8080, function () {
  console.log('Started. Listening...');
});