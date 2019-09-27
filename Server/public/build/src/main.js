// External Dependencies
var express = require('express');
var http = require('http');
var SocketIO = require('socket.io');
// Global Fields
var app = express();
var httpServer = http.createServer(app);
var socketServer = SocketIO(httpServer);
var port = 3000;
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.send('Welcome!');
});
socketServer.on('connection', function (socket) {
    console.log("Socket server connection, " + socket.conn + ".");
});
httpServer.listen(port, function () {
    console.log("Http server listening on port " + port + ".");
});
//# sourceMappingURL=main.js.map