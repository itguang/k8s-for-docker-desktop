const http  = require('http');
const os  = require('os');
console.log("Kubia Server is Starting ...");

var handler = function (request,response){
    console.log("Received message from "+ request.connection.remoteAddress);
    response.writeHead(200);
    response.end("You've Hit "+os.name+"\n");
}

http.createServer(handler).listen(8080);
