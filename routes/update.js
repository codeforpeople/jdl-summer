var exec = require('child_process').exec;

var update = function (req, res) {

	var PATH = process.env.UPDATE_PATH.toString();
	exec(PATH);
	res.end(0);
};

module.exports = update;