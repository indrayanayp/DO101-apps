var express = require('express');
const {execSync} = require('child_process');
const app = express();

app.get('/', function (req, res) {
  res.send('We are all happy! \n');
});

app.get('/test', function (req, res) {
  res.send(process.env.TEST123);
});

app.get('/mars', function(req, res) {
  res.send('Hello Mars!\n');
});

const server = app.listen(8080, () => console.log('Running…'));

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
        execSync('sleep 15');
        //process.exit(0) is disabled as it prints error whenever a pod is terminated
        //process.exit(0);
    });
    execSync('sleep 30');

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 30000);

    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(curr => curr.destroy()), 30000);
}
