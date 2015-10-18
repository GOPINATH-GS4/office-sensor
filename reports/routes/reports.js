/* Author : Janakiraman Gopinath */
module.exports = function(app, _, utils) {
    // 
    // report.js
    //
    var fs = require('fs'),
        dataModel = require('../../api/models/dataModel.js').dataModel,
        async = require('async'),
        _ = require('underscore');
    var db = new dataModel();
    var results = [];

    var reports = function(req, res) {

        // Clear the array
        results.splice(0, results.length);

        var param = req.query;

        var start_date = new Date(req.query.start_date);
        var end_date = new Date(req.query.end_date);
        var room = req.query.room;
        var incr = req.query.incr || 5;
        var cnt = req.query.cnt || 10;
        var crowd_analysis = req.query.crowd_analysis;
        var count = 0;
        var index = 0;
        var arr = [];
        while (start_date < end_date) {
            count++;
            var dt = new Date(start_date.getTime() + incr * 60000);

            var range = {
                start_date: start_date,
                end_date: dt,
                cnt: 0
            };
            (function(range) {
                arr.push(function(callback) {
                    getData(callback, range, room, incr, cnt, crowd_analysis);
                });
            })(range);
            start_date = dt;
        }

        async.series(arr, function(err) {
            console.log('All complete');


            if (crowd_analysis === 'true') {
                var max = _.max(results, function(result) {
                    return result.crd;
                });

                _.each(results, function(result) {
                    if (result.cnt != 0) result.cnt = (30 * incr  > max.crd) ? 30 * incr : max.crd;
                });
            }

            //console.log(JSON.stringify(results, null, 10));
            console.log(max);
            utils.writeResponse(req, res, results);
        });
    }
    var callback = function() {};

    var getData = function(callback, range, resource, incr, cnt, crowd_analysis) {

        //console.log('Executing Range' + JSON.stringify(range));
        db.Measurements.find({
            resource: resource,
            $and: [{
                dt: {
                    $gte: range.start_date
                }
            }, {
                dt: {
                    $lt: range.end_date
                }
            }]
        }, function(err, docs) {
            if (err)
                console.log(err);
            else {
                if (docs.length >= cnt) {
                    range.cnt = cnt;

                    if (crowd_analysis === 'true')
                        range.crd = docs.length;
                    else
                        range.crd = 0;
                } else {
                    range.cnt = 0;
                    range.crd = 0;
                }
            }
            results.push(range);
            callback();
        });

    }

    app.get('/reports', reports);
}
