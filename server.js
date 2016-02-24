'use strict';

const cluster = require('cluster');
const express = require('express');
const os = require('os');

// If in the master process, create a worker for each cpu

if (cluster.isMaster) {
  for (let i = 0; i<os.cpus().length; i += 1) {
    cluster.fork();
  }

  // when the process dies, replace it
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    cluster.fork();
  });
} else {

  const app = express();
  app.listen(3000);

  app.get('/clustered', (req, res) => {
    res.status(200).send(`Running on worker with id #${cluster.worker.id}`);
  });
}

// const cluster = require('cluster');
// const http = require('http');
// const numCPUs = require('os').cpus().length;
//
// if (cluster.isMaster) {
//   // Fork workers.
//   for (var i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
//   // Workers can share any TCP connection
//   // In this case it is an HTTP server
//   http.createServer((req, res) => {
//     res.writeHead(200);
//     res.end('hello world\n');
//   }).listen(8000);
// }
