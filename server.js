"use strict";

const http = require('http');
const finalhandler = require('finalhandler');
const Router = require('router');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const urlParser    = require('url');
const querystring  = require('querystring');
const router = new Router({
  mergerParams: true
});
router.use(bodyParser.json());

//let messages = [{"id":1,"message":"This is a test message."},
//{"id":3,"message":"Our third message."},
//{"id":2,"message":"Our second message."}];

let messages = [];
let nextId = 1;

class Message {
  constructor(message) {
    this.id = nextId;
    this.message = message;
    nextId++;
  }
}


router.get('/', (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  response.write("Hello, World!");
  response.end();
});

router.post('/message', (request, response) => {
  let message = request.body.message;
  let msgObj = new Message(message);
  messages.push(msgObj);

  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(msgObj.id));
});



router.get('/messages', (request, response) => {
  let url = urlParser.parse(request.url), params = querystring.parse(url.query);
   const messageList = JSON.stringify(messages);
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

    if(params.encrypt){
      response.setHeader('Content-Type', 'text/plain; charset=utf-8');

      return bcrypt.hash(messageList, 10, function(err,hash) {
        if(err){
          throw new Error();
        }
              response.end(hash);
      });
    }


  response.end(messageList);
});


router.get('/messages/:id', (request, response) => {
  let url = urlParser.parse(request.url), params = querystring.parse(url.query);
  console.log(params);
  const msgId = parseInt(request.params["id"]);


  const foundMsg = messages.find(function(message) {
    return message.id === msgId;
  });

  const result = JSON.stringify(foundMsg);

  response.end(result);


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
