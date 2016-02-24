'use strict';

const amqp = require('amqplib/callback_api');


// setting it up the same as the sender; we open a connection and a channel,
// and declaring the queue from which were going to consume
// (!) this matches up with the queue that sendToQueue publishes to


// Because we might start the receiver before the sender, we want to make sure
// the queue exists before we try to consume messages from it.

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    const q = 'hello';

    ch.assertQueue(q, { durable: false });

    // Since it will push us messages asynchronously, we provide a callback that
    // will be executed when RabbitMQ pushes messages to our consumer

    console.log('[*] Waiting for messages in %s. To exit press CTRL + C', q);
    ch.consume(q, (msg) => {
      console.log('[x] Received %s', msg.content.toString());
    }, { noAck: true });
  });
});
