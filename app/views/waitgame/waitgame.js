var WaitgameViewModel = require("../../shared/view-models/waitgame-view-model");
var fetchModule = require("fetch");
var config = require("../../shared/config");
var frameModule = require("ui/frame");

var waitgameView = new WaitgameViewModel();

// 5 seconds countdown
var countdownTime = 5000;
var lastTimeout;

function startGame(){
    console.log('hit start game');
    frameModule.topmost().navigate({
                	moduleName: "views/question/question",
                	context: { timeToStart: countdownTime }
		});
}

function startCountdown(){
    fetchModule.fetch(config.apiUrl + "timeToStart")
        .then((response) => handleErrors(response))
        .then((response) => response.json())
        .then(function(response) {
            clearTimeout(lastTimeout);
            lastTimeout = setTimeout(startGame, response.timeToStart-countdownTime);
        });
}

exports.pageNavigatedTo = function(args) {
    var page = args.object;
    page.bindingContext = waitgameView;
    waitgameView.getData();
    startCountdown();
    setInterval(startCountdown, 30000);
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}
