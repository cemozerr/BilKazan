//  /-----------\
//  | WebSocket |
//  \-----------/
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8111 });
console.log('Started WebSocket server');

wss.broadcast = function broadcastMsg(msg) {
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};

wss.on("connection", function(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.on('open', function open() {
        console.log('client connected');
    });

    ws.on('close', function close() {
        console.log('client disconnected');
    });

    ws.send('Connection Successful');
});

//  /------------------\
//  | STDIN Management |
//  \------------------/
//
var stdin = process.stdin;
stdin.setEncoding('utf8');
//stdin.setRawMode( true );

// on any data into stdin
stdin.on( 'data', function(key){
    if (key === '\u0003') {
        process.exit();
    }
    if (key == 'c\n'){
        wss.broadcast('Continue to next phase');
    }
});



