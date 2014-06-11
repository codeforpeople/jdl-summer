var Database = require('./database.js');

var SystemManager = function () {
	
	var db = new Database();

	var registerNewMentor = function (firstName, surname, email, univ, degree, year, password, cb) {
		db.registerMentor({
			mid: db.generateId(),
			firstname: firstname,
			surname: surname,
			email: email,
			university: univ,
			degree: degree,
			year: year,
			password: password,
			status: 'pending',
			admin: 'no'
		}, cb);
	};

	var updateMentorStatus = function (mid, status, cb) {
		db.updateMentor(mid, {
			status: status
		}, cb);
	};

	var updateMentorPhoto = function (mid, photo, cb) {
		db.updateMentor(mid, {
			photo: photo
		}, cb);
	};

	var updateMentorDetails = function (mid, firstName, surname, email, univ, degree, year, cb) {
		db.updateMentor(mid, {
			firstname: firstname,
			surname: surname,
			email: email,
			university: univ,
			degree: degree,
			year: year	
		}, cb);
	};

};

module.exports = SystemManager;