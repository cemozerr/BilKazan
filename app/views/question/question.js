// create webSocket connection to server
const WebSocket = require('nativescript-websockets');
const ws = new WebSocket('ws://127.0.0.1:8111', {timeout:0});
var stringify = require('json-stringify-safe');

ws.open();

ws.on('open', function(socket) { 
    console.log("WebSocket connection established to server"); 
});

ws.on('close', function(socket){
    console.log("WebSocket connection lost"); 
    ws.open();
});

ws.on('message', function incoming(socket, message) {
    console.log("Printing message from server:");
    console.log(message);
    movePhase();
});

var QuestionViewModel = require("../../shared/view-models/question-view-model");
var config = require("../../shared/config");
var fetchModule = require("fetch");
var page;
var questionView = new QuestionViewModel();
var answerChosen;
var answerButtons = [];
var questionNumber = 0;
// if question phase equal to 0, else phase equal to 1
var phase = 0;

exports.navigatedTo = function(args) {
    page = args.object;
    page.bindingContext = questionView;
    answerButtons = [page.getViewById('1'), page.getViewById('2'), page.getViewById('3')];
};

exports.changeColor = function(args) {
    if (answerChosen == 1) {
        return;
    }
    var btn = args.object;
    btn.backgroundColor = "black";
    answerChosen = 1;
}

function movePhase(){
    if (phase == 0){
        showQuestion();
        phase = 1;
    }
    else {
        showAnswer();
        phase = 0;
        questionNumber = questionNumber + 1;
    }
}

function showQuestion(){
    // set all buttons blue 
    answerButtons.forEach((button) => button.backgroundColor = "blue");

    // make answer buttons clickable 
    answerChosen = 0;

    // update view model with new question & answers
    questionView.getQuestion(questionNumber);
}

function showAnswer(){
    fetchModule.fetch(config.apiUrl + "getAnswer", {
        method: "POST",
        body: JSON.stringify({
            number: questionNumber
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((response) => handleErrors(response))
        .then((response) => response.json())
        .then(function(response) {
            // set correct answer green
            page.getViewById(response.correctAnswer).backgroundColor = "green";
        });
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}
