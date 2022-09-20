var express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('We are all happy 3! \n');
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
process.on('SIGKILL', shutDown);

let connections = [];

server.on('connection', connection => {
    connections.push(connection);
    connection.on('close', () => connections = connections.filter(curr => curr !== connection));
});

function shutDown() {
    console.log('Received kill signal, shutting down gracefully');
    setTimeout(() => {
        server.close(() => {
            console.log('Closed out remaining connections');
            process.exit(0);
        });
    }, 10000);

    //server.close(() => {
      //  console.log('Closed out remaining connections');
        //process.exit(0) is disabled as it prints error whenever a pod is terminated
        //process.exit(0);
    //});

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 20000);

    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(curr => curr.destroy()), 30000);
}
