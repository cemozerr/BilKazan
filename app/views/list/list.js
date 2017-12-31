var dialogsModule = require("ui/dialogs");
var observableModule = require("data/observable")
var QuestionViewModel = require("../../shared/view-models/question-view-model");
var page;

var questionView = new QuestionViewModel();
/*
var pageData = new observableModule.fromObject({
    questionNumber: 'Question 3',
    question: 'Istanbul hangi yılda Osmanlı Imparatorluğu tarafından fethedilmiştir?',
    answer1 : '1423',
    answer2 : '1453',
    answer3 : '1373',
});
*/

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = questionView;
    console.log('EXPORTS.LOADED CALLED');

    questionView.getQuestion();
};
