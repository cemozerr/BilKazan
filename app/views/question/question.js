var QuestionViewModel = require("../../shared/view-models/question-view-model");
var config = require("../../shared/config");
var fetchModule = require("fetch");

var page;
var questionView = new QuestionViewModel();
var timeToStart = 'NA';
var answerChosen;
var answerButtons = [];

const interval = 8000;
const answerWaitTime = 4000;

function showAnswer(){
    fetchModule.fetch(config.apiUrl + "getAnswer")
            .then((response) => handleErrors(response))
            .then((response) => response.json())
            .then(function(response) {
                // set the button containing the correct answer green
                page.getViewById(response.correctAnswer).backgroundColor = "green";
            });
}

function showQuestion(){
    if (answerButtons.length > 0){
        answerButtons.map((button) => button.backgroundColor = "blue");
    }
    answerChosen = 0;
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
    refreshQuestion();
    setTimeout(refreshAnswer, answerWaitTime);
}

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = questionView;
    
    answerButtons = [page.getViewById('0'), page.getViewById('1'), page.getViewById('2')];

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
    if (answerChosen == 1) {
        return;
    }
    var btn = args.object;
    btn.backgroundColor = "black";
    answerChosen = 1;
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}
