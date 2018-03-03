var WaitgameViewModel = require("../../shared/view-models/waitgame-view-model");
var waitgameView = new WaitgameViewModel();
var questionView = require("../question/question");
const frameModule = require("ui/frame");

// create webSocket connection to server
const WebSocket = require('nativescript-websockets');
const ws = new WebSocket('ws://127.0.0.1:8111', {timeout:0});
ws.open();

ws.on('open', function(socket) { 
    console.log("WebSocket connection established to server"); 
});

ws.on('close', function(socket){
    console.log("WebSocket connection lost"); 
    ws.open();
});

// 3 scenarios
// s: game starts --> move from waitgame to question view
// m: game moves to next phase --> movePhase() in question screen
// e: game ends -->  move from question to waitgame view
ws.on('message', function incoming(socket, message) {
    console.log("Printing message from server:");
    console.log(message);

    switch (message) {
        case 'start':
            frameModule.topmost().navigate("views/question/question");
            break;
        case 'move':
            questionView.movePhase();
            break;
        case 'end':
            questionView.resetGame();
            frameModule.topmost().navigate("views/waitgame/waitgame");
            break;
    } 
});

exports.pageNavigatedTo = function(args) {
    var page = args.object;
    page.bindingContext = waitgameView;
    waitgameView.getData();
}
