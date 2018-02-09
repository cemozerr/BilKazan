var application = require('application');
var frameModule = require("ui/frame");
var dialogsModule = require("ui/dialogs");
var fetchModule = require("fetch");
var config = require("../../shared/config");
var view = require("ui/core/view");
var page;
var usernameView;

exports.loaded = function(args) {
    page = args.object;
    usernameView = view.getViewById(page, "username");
}

exports.adduser = function(args){
    fetchModule.fetch(config.apiUrl + "registerUser", {
        method: "POST",
        body: JSON.stringify({
            username: usernameView.text
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => handleErrors(response))
    .then((response) => response.json())
    .then((data) => (data.message))
    .then((message) => {
        if(message == 'Access Granted'){
            frameModule.topmost().navigate("views/waitgame/waitgame");
        }
        else{
            dialogsModule.alert({
                message: "Kullanıcı adı alınmış",
                okButtonText: "Tamam"
            });
            usernameView.text = '';
        }
    })
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}
