// The main idea behind Work Queues (aka: Task Queues) is to avoid doing a
// resource-intensive task immediately and having to wait for it to complete.
//
// Instead we schedule the task to be done later. We encapsulate a task as a
// message and send it to a queue. A worker process running in the background will
// pop the tasks and eventually execute the job. When you run many workers the
// tasks will be shared between them.


// This concept is especially useful in web applications where it's impossible to
// handle a complex task during a short HTTP request window.

'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    const q = 'task_queue';

    const msg = process.argv.slice(2).join(' ') || 'Hello, World!';

    ch.assertQueue(q, { durable: true });
    ch.sendToQueue(q, new Buffer(msg), { persistent: true });
    console.log('[x] Sent \'%s\'', msg);

    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 500);
  });
});
