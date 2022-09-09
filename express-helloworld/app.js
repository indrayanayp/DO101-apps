var express = require('express');
const app = express();
const serverStoppers = require('./serverStoppers')

app.get('/', function (req, res) {
  res.send('We are all happy! \n');
});

app.get('/test', function (req, res) {
  res.send(process.env.TEST123);
  res.set("Connection", "close");
});

app.get('/mars', function(req, res) {
  res.send('Hello Mars!\n');
});

const server = app.listen(8080, () => console.log('Running…'));

const startGracefulShutdownFunc = serverStoppers.getServerStopFunc(app);

setInterval(() => server.getConnections(
    (err, connections) => console.log(`${connections} connections currently open`)
), 1000);

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

let connections = [];

server.on('connection', connection => {
    connections.push(connection);
    connection.on('close', () => connections = connections.filter(curr => curr !== connection));
});

function shutDown() {
    console.log('Received kill signal, shutting down gracefully');
    startGracefulShutdownFunc();
    server.close(() => {
        console.log('Closed out remaining connections');
        //process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        //process.exit(1);
    }, 10000);

    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(curr => curr.destroy()), 10000);
}
