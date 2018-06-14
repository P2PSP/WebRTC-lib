var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {

});
server.listen(9033, function() { 
  console.log('Listening on port 9035');
});

//create the server
wsServer = new WebSocketServer({
  httpServer: server
});
//List of websocket connections with the Team
var teamMembers = [];
var splitter;
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  console.log(request);
  // all messages from peers here.     
  connection.on('message', function(message) {  
       //console.log(message.utf8Data);      
       var msg = JSON.parse(message.utf8Data);
       console.log(' parsed message ' + msg);
       //Register peer or splitter for the team
       if(msg.addSplitter || msg.addPeer) {
           var Id = msg.splitterId || msg.addPeer;
           console.log(Id);
           //store websocket connection
           teamMembers[Id] = connection;
       }
       //Signalling message to be relayed to the receiver
       else {
         console.log(msg);
         var receiver = msg.receiverId;
         console.log(receiver);
         console.log(teamMembers[receiver])
         //transmit over receiver's socket
         teamMembers[receiver].sendUTF(JSON.stringify(msg));
       }
  });

  connection.on('close', function(connection) {
    // close user connection
    console.log(connection + 'has closed');
  });
});