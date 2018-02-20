var appSettings = require("application-settings");
var frameModule = require("ui/frame");
var config = require("../../shared/config");
var fetchModule = require("fetch");
var observableModule = require("data/observable");

var codeView = new code();

exports.pageNavigatedTo = function(args) {
    var page = args.object;
    page.bindingContext = codeView;
    phone = page.navigationContext.phone;
}

exports.onDone = function(args) {
        codeView.verify()
        .then(function(response) {
            console.log(response);
            if (response == 'Code Wrong'){
                dialogsModule.alert({
                    message: response,
                    okButtonText: "OK"
                });
            }
            else {
                appSettings.setString("phonenumber", phone);
                if (response == 'Access Granted'){
                    console.log('inside access granted');
            	    frameModule.topmost().navigate({
                        moduleName: "views/waitgame/waitgame",
                        clearHistory: true,
                        animated: true
                    });
                }
                else {
                    frameModule.topmost().navigate({
                	moduleName: "views/adduser/adduser"
		    });
                }
            }
        });
}


function code(info) {
    info = info || {};

    var viewModel = new observableModule.fromObject({
        code: info.code|| ""
    });

    viewModel.verify = function() {
        return fetchModule.fetch(config.apiUrl + "verify", {
            method: "POST",
            body: JSON.stringify({
                code: viewModel.get("code"),
                phone: phone
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => handleErrors(response))
        .then((response) => response.json())
        .then((data) => (data.message))
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
