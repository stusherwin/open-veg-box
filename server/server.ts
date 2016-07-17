var express = require('express');
var path = require('path');

import {api} from './api'

var app = express();

app.use(express.static('client'));
app.use('/node_modules', express.static('node_modules'));

app.use('/api', api);

app.all('/*', function(req: any, res: any) {
  res.sendFile(path.resolve('client/index.html'));
});

app.listen(8080, function () {
  console.log('Started. Listening...');
});