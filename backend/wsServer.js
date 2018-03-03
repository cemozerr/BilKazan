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
    console.log('client connected');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
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
    switch (key) {
        case '\u0003':
            process.exit();
            break;
        case 's\n':
            wss.broadcast('start');
            break;
        case 'm\n':
            wss.broadcast('move');
            break;
        case 'e\n':
            wss.broadcast('end');
            break;
    }
});



