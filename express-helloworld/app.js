var express = require('express');
app = express();

app.get('/', function (req, res) {
  res.send('Everything is running smoothly but this is version 1!\n');
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

