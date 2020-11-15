const http  = require('http');
const os  = require('os');
console.log("Myapp Server is Starting ...");

var handler = function (request,response){
    console.log("Received message from "+ request.connection.remoteAddress);
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end("你现在访问的主机是： "+os.hostname()+"\n");
}

http.createServer(handler).listen(8080);
