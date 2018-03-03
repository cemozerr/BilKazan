var appSettings = require("application-settings");
var config = require("../../shared/config");
var fetchModule = require("fetch");
var observableModule = require("data/observable");

console.log('finished with requirements in view-model');

function WaitGame(info) {
    info = info || {};

    var viewModel = new observableModule.fromObject({
        nextGameDateTime: info.nextGameDateTime || "",
        nextGamePrize: info.nextGamePrize || "",
        username : info.username || "",
        userBalance : info.userBalance || ""
     });

    viewModel.getData = function(){
        return fetchModule.fetch(config.apiUrl + "getWaitGameData",{
            method: "POST",
            body: JSON.stringify({
                phone: appSettings.getString("phonenumber", "No phonenumber saved")
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => handleErrors(response))
        .then((response) => response.json())
        .then(function(response) {
            viewModel.nextGameDateTime = response.nextGameDateTime;
            viewModel.nextGamePrize = response.nextGamePrize;
            viewModel.username = response.username
            viewModel.userBalance = response.userBalance
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

module.exports = WaitGame;
