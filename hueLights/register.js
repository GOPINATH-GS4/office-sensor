var HueApi = require("node-hue-api").HueApi;

var hostname = "192.168.1.206",
    newUserName = null // You can provide your own username value, but it is normally easier to leave it to the Bridge to create it
userDescription = "Test user";

var displayUserResult = function(result) {
    console.log("Created user: " + JSON.stringify(result));
};

var displayError = function(err) {
    console.log(err);
};
var hue = new HueApi();

hue.registerUser(hostname, newUserName, userDescription)
    .then(displayUserResult)
    .fail(displayError)
    .done();

hue.createUser(hostname, null, null, function(err, user) {
    if (err) throw err;
    displayUserResult(user);
});