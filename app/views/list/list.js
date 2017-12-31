var dialogsModule = require("ui/dialogs");
var observableModule = require("data/observable")
var ObservableArray = require("data/observable-array").ObservableArray;
var page;

var pageData = new observableModule.fromObject({
    header: 'Question 3',
    question: 'Istanbul hangi yılda Osmanlı Imparatorluğu tarafından fethedilmiştir?',
    answer1 : '1423',
    answer2 : '1453',
    answer3 : '1373',
    correctAnswer: '0'
});

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;
};
