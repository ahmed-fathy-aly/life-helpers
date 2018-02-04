const request = require('request');
const requestPromise = require('request-promise');
const util = require('util')

require('./constants');

module.exports.distanceFromHome = (to, fullOutput = true) => {
	distanceWalkTransit(HOME_ADDRESS, to, fullOutput);
}

module.exports.distanceFromOffice = (to, fullOutput = true) => {
	distanceWalkTransit(OFFICE_ADDRESS, to, fullOutput);
}

function distanceWalkTransit(from, to, fullOutput = true) {
	distance(from, to, 'walking', fullOutput);
	distance(from, to, 'transit', fullOutput);
}
	
function distance(from, to, mode, fullOutput) {
	var options = {
	        method: 'GET',
	        uri: `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${from}&destinations=${to}&mode=${mode}&key=${DISTANCE_MATRIX_API_KEY}`,
	        json: true
	};
	requestPromise(options)
		.then(result => {
			if (fullOutput) {
				console.log(util.inspect(result, false, null));
			}
			if (result.status != 'OK') {
				console.log("failed");
			} else {
				const answer = result.rows[0].elements[0];
				if (answer.status != 'OK') {
					console.log("failed");
				} else {
					const distance = answer.distance.text;
					const duration = answer.duration.text;
					console.log(`${mode} ${distance} ${duration}`)
				}
			}
		});
}

require('make-runnable/custom')({
    printOutputFrame: false
})
