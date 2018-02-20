var application = require('application');
var appSettings = require("application-settings");
var frameModule = require("ui/frame");
var dialogsModule = require("ui/dialogs");
var fetchModule = require("fetch");
var config = require("../../shared/config");
var view = require("ui/core/view");
var page;
var phone;
var usernameView;

exports.pageNavigatedTo = function(args) {
    page = args.object;
    phone = page.navigationContext.phone;
    usernameView = view.getViewById(page, "username");
}

exports.adduser = function(args){
    fetchModule.fetch(config.apiUrl + "registerUser", {
        method: "POST",
        body: JSON.stringify({
            username: usernameView.text,
            phone: phone 
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
            appSettings.setString("phonenumber", phone)
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
