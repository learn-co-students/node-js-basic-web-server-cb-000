"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser = require('body-parser');
const bcrypt       = require('bcrypt');
const router = new Router({ mergeParams: true });
router.use(bodyParser.json());

let messages = [];
var idnum = 1;


router.get('/', (request, response) => {
  // A good place to start!
  var encoding = 'text/plain; charset=utf-8'
  var text = "Hello, World!" ;
  response.setHeader('Content-Type', encoding) ;
  response.statusCode = 200;
  response.write('Hello, World!');
  response.end();
});
router.post('/message', (request, response) => {
  var words = request.body ;
  var message = {message: words["message"], id: idnum} ;
  idnum += 1 ;
  messages.push(message)  ;
  response.setHeader('Content-Type', 'application/json; charset=utf-8') ;
  response.statusCode = 200 ;
  response.write(`${message.id}`) ;
  response.end() ;
});
router.get('/messages', (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8') ;
  response.statusCode = 200 ;
  response.end(JSON.stringify(messages)) ;

})
router.get('/message/:id', (request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8') ;
  response.statusCode = 200 ;
  var mess = messages.find(function(message){
    return   message.id == request.params.id
  })
  var thing = "no such luck"
  if (!!mess){thing = JSON.stringify(mess) }
  response.end(thing) ;
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
