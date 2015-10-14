var fs = require('fs'),
    dataModel = require('./models/dataModel.js').dataModel,
    _ = require('underscore');

var db = new dataModel();


db.Measurements.find({
    $query: {
        $or: [{
            "measurement.value": 1
        }, {
            "measurement.value": 0
        }]
    },
    $orderby: {
        dt: 1
    }
}, {
    "measurement.value": 1,
    dt: 1,
    "_id": 0
}, function(err, measurements) {

    if (err)
        console.log(err);
    else {
        var prev_dt = null;
        var prev_val = null;
	var start = false;
        _.each(measurements, function(m) {

	    var dt = m.dt;
	    
	    dt = new Date(dt.setHours(dt.getHours() + 4));
            var value = m.measurement[0].value;

	    if(!prev_dt) prev_dt = dt;

	    if(value === 0) {
		start = true;		
		prev_dt = dt;
            }

	    if(value === 1 && start && ((dt - prev_dt) / 60000 ) > 5) {
		console.log('Resource free from ' + prev_dt + " till " + dt);
		start = false;
	    }

        });
        db.db.close();
    }
});
