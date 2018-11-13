"use strict";

const bodyParser = require('body-parser');
const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');

let messages = [];

const router = new Router({ mergeParams: true });

router.use(bodyParser.json());

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end('Hello, World!');
});

router.get('/messages', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(messages));
});

router.post('/message', (req, res) => {
  messages.push(req.body);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(req.body.id));
});

router.get('/message/:id', (req, res) => {
  const messageObj = messages.find(message => message.id === parseInt(req.params.id));
  if (messageObj) {
    const result = messageObj.message;
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.statusCode = 200;
    res.end(result);
  } else {
    res.statusCode = 404;
  }
});

const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function(port, callback) {
  server.listen(port, callback);
};

exports.close = function(callback) {
  server.close(callback);
};
