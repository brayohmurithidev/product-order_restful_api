const http = require('http') // import http

const app = require('./app');

const port = process.env.PORT || 5000

const server = http.createServer(app); //create our createServer

server.listen(port); //run the server 

