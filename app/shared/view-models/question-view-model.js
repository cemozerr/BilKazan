var config = require("../../shared/config");
var fetchModule = require("fetch");
var observableModule = require("data/observable");


function Question(info) {
    info = info || {};

    var viewModel = new observableModule.fromObject({
        questionNumber: info.questionNumber || "",
        question: info.question || "",
        answer1 : info.answer1 || "",
        answer2 : info.answer2 || "",
        answer3 : info.answer3 || ""
     });

    viewModel.getQuestion = function(number){
        return fetchModule.fetch(config.apiUrl + "getQuestion", {
            method: "POST",
            body: JSON.stringify({
                number: number 
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })        
        .then((response) => handleErrors(response))
        .then((response) => response.json())
        .then(function(response) {
            viewModel.questionNumber = number;
            viewModel.question = response.question;
            viewModel.answer1 = response.answer1;
            viewModel.answer2 = response.answer2;
            viewModel.answer3 = response.answer3;
        });
    };

    return viewModel;
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

module.exports = Question;
