var express = require('express');
app = express();

app.get('/', function (req, res) {
  res.send('We are all happy! \n');
});

app.get('/test', function (req, res) {
  res.send(process.env.TEST123);
  res.send(' \n');
});

app.get('/mars', function(req, res) {
  res.send('Hello Mars!\n');
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
  
});

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    debug('HTTP server closed')
  })
})

