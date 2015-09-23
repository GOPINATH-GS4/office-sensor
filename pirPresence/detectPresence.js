var Gpio = require('onoff').Gpio,
  pir = new Gpio(17, 'in', 'both');

var request = require('request'); 

function updateServer(value) {
	

var payload = {
	headers: {},
	url : 'http://syrinx.merck.com:8402/v1/data/',
        method : 'POST',
	json: {
		dt: new Date(),
		resource: 'Room-1263',
		tags : [],
		measurement: [{
			name: 'presence',
			value: value,
			unit: 'bool'
		}]
	}
}

request(payload, function(err, body, response) {
	if(err) 
		console.log(err);
	else 
		console.log(response);
});

}

pir.watch(function(err, value) {
  console.log('Err ' + err);
  console.log('Movement detected');
  console.log('Value ' + value);

   updateServer(value);
});
