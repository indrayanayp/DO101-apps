var express = require('express');
const app = express();

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

/*const server = app.listen(8080, () => console.log('Running…'));

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
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);

    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
}
*/

const GracefulShutdownManager = require('@moebius/http-graceful-shutdown').GracefulShutdownManager;

const server = app.listen(8080);

const shutdownManager = new GracefulShutdownManager(server);

process.on('SIGTERM', () => {
  shutdownManager.terminate(() => {
    console.log('Server is gracefully terminated');
  });
});
