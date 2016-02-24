'use strict';

const amqp = require('amqplib/callback_api');


// connect to rabbitmq server
amqp.connect('amqp://localhost', (err, conn) => {
  // channel where most of the API getting things done resides
  conn.createChannel((err, ch) => {

    // declare a queue to send to
    const q = 'hello';

    ch.assertQueue(q, { durable: false });
    // publish a message to the queue
    ch.sendToQueue(q, new Buffer('Hello, World!'));
    console.log('[x] Sent \'Hello, World!\' ');

    // Declaring a queue is idempotent - it will only be created if it doesn't
    // already exist

    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 500);
  });
});
