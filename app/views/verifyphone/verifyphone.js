var page;
var frameModule = require("ui/frame");
var config = require("../../shared/config");
var fetchModule = require("fetch");
var observableModule = require("data/observable");

var codeView = new code();
var phone;

exports.navigatedTo = function(args) {
    page = args.object;
    phone = page.navigationContext.phone;
    console.log(phone);
    page.bindingContext = codeView;
}

exports.onDone = function(args) {
        codeView.verify()
        .then(function(response) {
            if (response == 'Access Granted'){
            	frameModule.topmost().navigate({
                	moduleName: "views/question/question",
		});
            }
            else {
                dialogsModule.alert({
                    message: response,
                    okButtonText: "OK"
                });
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
