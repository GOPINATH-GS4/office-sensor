var mongoose = require('mongoose'),
    db = mongoose.createConnection(process.env.office_sensor_db || 'localhost:27017/office_sensor'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var dataModel = function() {

    /**
     *
     * @type {mongoose.Schema}
     * schema cannot be instantiated outside
     */

    var Measurement = new Schema({
        dt: Date,
	resource: String,
	tag: [String],
	measurement : [Datapoint] 
    });

    var Datapoint = new Schema({
        name: String,
        value: String, 
        unit: String
    });

    this.Measurements = db.model('Measurements', Measurement);
    this.db = db;

};
exports.dataModel = dataModel;
