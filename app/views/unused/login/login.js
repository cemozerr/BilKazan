var frameModule = require("ui/frame");
var UserViewModel = require("../../shared/view-models/user-view-model");
var dialogsModule = require("ui/dialogs");

var user = new UserViewModel();
var page;
var email;

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = user;
};

exports.signIn = function() {
    user.login()
    .then(function(response) {
        if (response == 'Access Granted'){
            frameModule.topmost().navigate("views/question/question");
        }
        else {
            dialogsModule.alert({
                message: response,
                okButtonText: "OK"
            });
        }
        return Promise.reject();
    });
};

exports.register = function() {
    frameModule.topmost().navigate("views/register/register");
};
