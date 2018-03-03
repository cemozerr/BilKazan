var stringify = require('json-stringify-safe');
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

exports.movePhase = function(){
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

exports.resetGame = function(){
    questionView.reset();
    questionNumber = 0;
    phase = 0;
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
