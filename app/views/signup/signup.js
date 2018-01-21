var frameModule = require("ui/frame");
var page;

exports.loaded = function(args) {
    page = args.object;
}

exports.signup = function(args) {
    frameModule.topmost().navigate({
        moduleName:"views/addphone/addphone", 
        animated: true 
    });
}
