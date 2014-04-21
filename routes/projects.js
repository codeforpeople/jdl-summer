var fs = require('fs');

var projects = function (req, res) {

	var data = fs.readFileSync('data/projects.json');
	data = JSON.parse(data);
	data.index = -1;

	if (typeof req.query.id != 'undefined') {
		var id = req.query.id;

		for (var i = 0; i < data.projects.length; i++) {
			if (data.projects[i].id === id) {
				data.index = i;
				break;
			}
		};
	}

	res.render('projects', { title: 'Junior Development Lab', data: data });
};

module.exports = projects;