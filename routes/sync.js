var fs = require('fs');

var sync = function (req, res) {

	var result = {};

	var id = req.body.id;
	if (typeof id === 'undefined') {
		result.status = -1;
		result.error = 'undefined';
	} else {
		result.status = -2;
		
		var data = fs.readFileSync('./data/projects.json');
		data = JSON.parse(data);

		for (var i = data.length - 1; i >= 0; i--) {
			if (data[i].id === id) {
				result.data = data[i];
				result.status = 0;
				break;
			}
		};
	}


	result = JSON.stringify(result);
	res.end(result);
};

module.exports = sync;