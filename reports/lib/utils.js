var utils = function() {

    this.writeResponse = function(req, res, response) {

        //console.log('-----------------------------  Response ---------------------------------');
        //console.log(JSON.stringify(response,null,10));
        //console.log('--------------------------  Response END ---------------------------------');

        var returnResponse = JSON.parse(JSON.stringify(response));
        var status = 200;

        res.writeHead(status, {
            'Content-Length': Buffer.byteLength(JSON.stringify(returnResponse), 'utf8'),
            'Content-Type': 'application/json',
        });
        res.write(JSON.stringify(returnResponse));
        res.end();
    }
}
exports.utils = utils;
