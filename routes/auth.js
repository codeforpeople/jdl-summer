var fs = require('fs');

var auth = function (req, res) {

	var status = 0;
	var user = null;

	console.log(req.query.id);

	if (req.session.passport.user != null && typeof req.session.passport.user !== 'undefined' && typeof req.session.passport.user.id !== 'undefined') {
		status = 1;
		user = {};
		user.name = req.session.passport.user.name;
		user.email = req.session.passport.user.emails[0].value;
		user.highschool = '';
		user.project = {};

		for (var i = req.session.passport.user['_json'].education.length - 1; i >= 0; i--) {
			var x = req.session.passport.user['_json'].education[i];
			if (x.type === 'High School') {
				user.highschool = x.school.name;
				break;
			}
		};

		status = -2;

		projects = JSON.parse(fs.readFileSync('../data/projects.json'));
		for (var i = projects.length - 1; i >= 0; i--) {
			if (projects[i].id === req.query.id) {
				user.project.name = projects[i].name;
				user.project.id = projects[i].id;
				status = 1;
			}
		};
	}

	res.render('auth', { status: status, user: user });
};

module.exports = auth;