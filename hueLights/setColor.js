var HueApi = require("node-hue-api").HueApi;

var colors = {
    red: [0.7,0.2986],
    green: [0.214,0.709],
    yellow: [0.3852,0.3737],
    white: [0.3227,0.329]	
};


var light = process.argv[2] || 5;
var color = colors[process.argv[3]] || colors.white;
var hostname = process.env.hueHostname || "192.168.1.2",
    username = process.env.hueUser || "1e1213d83ad8bbf1cddd8835342bcf";

api = new HueApi(hostname, username);

api.lightStatus(light, function(err, l) {
    if (err) console.log(err);
    else {
        console.log(l);
        api.setLightState(light, {
            "on": true
        }, function(err, l) {
            if (err) console.log(err);
            else {
                api.setLightState(light, {
                    xy: color
                }, function(err, l) {
                    if (err) console.log(err);
                    else
                        console.log(l);
                });
            }
        });
    }
});
