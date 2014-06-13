var manager = require('../lib/framework.js')();
var fs = require('fs');
var mail = require('nodemailer').mail;

var apply = function (req, res) {

	var result = {};
	var user = req.session.passport.user;

	var appData = req.body;
	console.log(appData);

	if (user === null || typeof user === 'undefined' || typeof user.id === 'undefined') {
		result.status = 'Aplicația nu a avut succes. Trebuie să te loghezi cu Facebook înainte.';
		result.title = 'Ne pare rău';
		result.code = -1;
		res.render('apply', { result: result });
	} else {
		manager.checkApplication(appData.pid, user.id, function (err, data) {
			if (err) console.log(err);
			
			if (data.length === 0) {
				// can proceed

				var project = null;

				var projects = JSON.parse(fs.readFileSync('./data/projects.json'));
				for (var i = projects.length - 1; i >= 0; i--) {
					if (projects[i].id === appData.pid) {
						project = projects[i];
						console.log(project);
						break;
					}
				};

				if (project === null) {
					console.log('no project');
					// error invalid data
					result.title = 'Ne pare rău';
					result.status = 'A apărut o eroare! Te rugăm să reîncerci.';
					result.code = -3;
					res.render('apply', { result: result });
				} else {

					manager.saveApplication(user.id, 
						appData.firstName, 
						appData.lastName, 
						appData.email, 
						appData.highschool, 
						appData.grade, 
						project.name, 
						appData.pid, 
						function (err, data) {
							if (err) console.log(err);

							if (data) {

								// send email to mentor
								mail({
									from: 'support@jdl.ro',
									to: project.mentor.email,
									subject: '[JDL] Someone applied to one of your projects',
									text: 'test'
								});

								mail({
									from: 'support@jdl.ro',
									to: 'onea.alex@gmail.com',
									subject: '[JDL] New application',
									text: 'test'
								});

								result.title = 'Felicitări';
								result.status = 'Ai aplicat cu success la proiect! Vei primi un e-mail de confirmare în curând.'
								result.code = 0;
							} else {
								result.title = 'Ne pare rău';
								result.status = 'A apărut o eroare internă! Te rugăm să reîncerci.';
								result.code = -3;
							}
							res.render('apply', { result: result });
						}
					);
				}

			} else {

				// already applied
				result.title = 'Ne pare rău';
				result.status = 'Ai aplicat deja la acest proiect! Îți mulțumim pentru interes.'
				result.code = -2;
				res.render('apply', { result: result });
			}
		});
	}
};

module.exports = apply;