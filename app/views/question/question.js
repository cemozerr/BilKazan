var QuestionViewModel = require("../../shared/view-models/question-view-model");
var config = require("../../shared/config");
var fetchModule = require("fetch");

var page;
var questionView = new QuestionViewModel();
var timeToStart;
var answerChosen;
var answerButtons = [];
var intervals = [];

const numQuestions = '6'; 
const questionChangeTime = 8000;
const answerWaitTime = 4000;

function showAnswer(){
    fetchModule.fetch(config.apiUrl + "getAnswer")
            .then((response) => handleErrors(response))
            .then((response) => response.json())
            .then(function(response) {
                // set the button containing the correct answer green
                page.getViewById(response.correctAnswer).backgroundColor = "green";
                
                // if the game has ended, clear the intervals to stop asking 
                // backend for updates
                if (response.questionNumber == numQuestions) {
                    clearIntervals();
                    // TODO: switch to game finished page
                }
            });
}

function showQuestion(){
    if (answerButtons.length > 0){
        answerButtons.forEach((button) => button.backgroundColor = "blue");
    }
    answerChosen = 0;
    questionView.getQuestion();
}

function refreshQuestion(){
    showQuestion();
    intervals.push(setInterval(showQuestion, questionChangeTime));
}

function refreshAnswer(){
    showAnswer();
    intervals.push(setInterval(showAnswer, questionChangeTime));
}

function clearIntervals(){
    intervals.forEach((interval) => clearInterval(interval));
}

function startGame(){
    refreshQuestion();
    setTimeout(refreshAnswer, answerWaitTime);
}

exports.navigatedTo = function(args) {
    page = args.object;
    page.bindingContext = questionView;
    
    answerButtons = [page.getViewById('0'), page.getViewById('1'), page.getViewById('2')];

    timeToStart = page.navigationContext.timeToStart;
    setTimeout(startGame, timeToStart);
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
