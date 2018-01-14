var QuestionViewModel = require("../../shared/view-models/question-view-model");
var config = require("../../shared/config");
var fetchModule = require("fetch");

var page;
var questionView = new QuestionViewModel();
var timeToStart = 'NA';
var correctAnswer;
var correctButton;

const interval = 8000;
const answerWaitTime = 4000;

function showAnswer(){
    fetchModule.fetch(config.apiUrl + "getAnswer")
            .then((response) => handleErrors(response))
            .then((response) => response.json())
            .then(function(response) {
                correctAnswer = response.correctAnswer;
                correctButton = page.getViewById(correctAnswer);
                correctButton.backgroundColor = "green";
            });
}

function showQuestion(){
    correctButton.backgroundColor = "blue";
    questionView.getQuestion();
}

function refreshQuestion(){
    showQuestion();
    setInterval(showQuestion, interval);
}

function refreshAnswer(){
    showAnswer();
    setInterval(showAnswer, interval);
}

function startGame(){
    // QUICK FIX 
    correctButton = page.getViewById("1");
    // refresh questions 3 times every interval
    refreshQuestion();
    setTimeout(refreshQuestion, 500);
    setTimeout(refreshQuestion, 1000);

    // refresh answers 3 times every interval answerWaitTime after question refresh
    setTimeout(refreshAnswer, answerWaitTime);
    setTimeout(refreshAnswer, answerWaitTime + 500);
    setTimeout(refreshAnswer, answerWaitTime + 1000);
}

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = questionView;

    // Set timeout to call start game, if timeToStart hasn't been set
    if (timeToStart == 'NA') {
        fetchModule.fetch(config.apiUrl + "timeToStart")
            .then((response) => handleErrors(response))
            .then((response) => response.json())
            .then(function(response) {
                timeToStart = response.timeToStart;
                setTimeout(startGame, timeToStart);
            });
    }
};

exports.changeColor = function(args) {
    var btn = args.object;
    btn.backgroundColor = "black";
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}
