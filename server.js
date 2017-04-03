"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser = require('body-parser')
const router = new Router({ mergerParams: true });
const urlParser = require('url')
const querystring  = require('querystring');

let messages = []
let id = 1

class Message {
	constructor (message) {
		this.id = id;
		this.message = message;
		id ++;
	}
}

router.use(bodyParser.json());

router.get('/', (request, response) => {
  // A good place to start!
  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.end('Hello, World!');
});

router.get('/messages', (req, res) => {
	res.setHeader('Content-Type', 'application/json; charset=utf-8')
	res.end(JSON.stringify(messages))
})

router.get('/message/:id', (req, res) =>{
	let url = urlParser.parse(req.url);
	let params = querystring.parse(url.query)

	res.setHeader('Content-Type', 'application/json; charset=utf-8')

	console.log('>>>>>>>>>>>>', req.params.id)

	let reqestedMessage = messages.find(function(elem){
		return elem.id == req.params.id
	})

	console.log('<<<<<<<<', messages[req.params.id -1].message)

	console.log('&&&&&', reqestedMessage)

	res.end(JSON.stringify(reqestedMessage))
})

router.post('/message', (req, res) => {
	res.setHeader('Content-Type', 'application/json; charset=utf-8')
	let newMessage = new Message(req.body.message)
	messages.push(newMessage)
	console.log('>>>>>>>>>>>>', messages)
	res.end(JSON.stringify(newMessage.id))
})

const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function(port, callback) {
  server.listen(port, callback);
};

exports.close = function(callback) {
  server.close(callback);
};
