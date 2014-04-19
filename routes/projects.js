var fs = require('fs');

var projects = function (req, res) {

	var data = fs.readFileSync('data/projects.json');
	data = JSON.parse(data);

	res.render('projects', { title: 'Junior Development Lab', data: data });
};

module.exports = projects;