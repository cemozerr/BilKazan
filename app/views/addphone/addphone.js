var page;
var frameModule = require("ui/frame");
var config = require("../../shared/config");
var fetchModule = require("fetch");
var observableModule = require("data/observable");

var phoneView = new phoneNumber();

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = phoneView;
}

exports.onDone = function(args) {
        phoneView.sendvercode()
        .then(function() {
            	frameModule.topmost().navigate({
                	moduleName: "views/verifyphone/verifyphone",
                	context: { phone: phoneView.phone }
		});
        }); 
}


function phoneNumber(info) {
    info = info || {};

    var viewModel = new observableModule.fromObject({
        phone: info.phone|| ""
    });

    viewModel.sendvercode = function() {
        return fetchModule.fetch(config.apiUrl + "sendvercode", {
            method: "POST",
            body: JSON.stringify({
                phone: viewModel.get("phone"),
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
    };
    
    return viewModel;
}
