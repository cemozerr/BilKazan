var application = require("application");
var appSettings = require("application-settings");
console.log("Application starting");
if (appSettings.getString("phonenumber", "none found") != "none found"){
    console.log("old user");
    application.start({ moduleName: "views/question/question" });
}
else {
    console.log("new user");
    application.start({ moduleName: "views/question/question" });
}
