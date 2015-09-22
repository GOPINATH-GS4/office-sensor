module.exports = function(app, db, utils) {

    var data = function(req, res) {

        var method = req.method;

        var response = {
            http_status: 200,
            status: 200,
            result: {}
        }

        switch (method) {

            case 'POST':
                var payload = req.body;
                db.Measurements(payload).save(function(err) {
                    if (err)
                        response.result.error = err;
                    else
                        response.result.message = 'Successfully saved...';

                    utils.writeResponse(req, res, response);

                });
                break;
            case 'GET':

                var resource = req.path.split('/').pop();
		console.log(resource);
                db.Measurements.findOne({
                    resource: resource
                }, function(err, measurement) {
                    if (err)
                        response.result.err = err;
                    else
                        response.result.data = measurement;
                    utils.writeResponse(req, res, response);
                });
                break;
            default:
                break;
        }
    }
    app.post('/v1/data', data);
    app.get('/v1/data/:1', data);
}
