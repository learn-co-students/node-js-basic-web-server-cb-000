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
  response.statusCode = 200 ;
  if (request.url.includes('encrypt')) {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8') ;
    var temp = JSON.stringify(messages) ;
    return bcrypt.hash(temp, 10, (error, hash) =>{
      if (error) {
        response.end(thing) ;
      }
      response.end(hash) ;
    })
  }
  else {
    response.setHeader('Content-Type', 'application/json; charset=utf-8') ;
    response.end(JSON.stringify(messages)) ;
  }
})
router.get('/message/:id', (request, response) => {
  response.statusCode = 200 ;
  var mess = messages.find(function(message){
    return   message.id == request.params.id
  })
  var thing = "no such luck"

  if (!request.url.includes('encrypt')) {
    response.setHeader('Content-Type', 'application/json; charset=utf-8') ;
    if (!!mess){thing = JSON.stringify(mess) }
    response.end(thing) ;
  }
  else{
    var temp = JSON.stringify(mess) ;
    response.setHeader('Content-Type', 'text/plain; charset=utf-8') ;
    return bcrypt.hash(temp, 5, (error, hash) => {
      if (error) {
        throw new Error();
      }
      console.log("happening in hash")
      response.end(hash);
    });
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
