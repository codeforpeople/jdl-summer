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

	var getAllApplications = function (cb) {
		db.getAllApplications(cb);
	};

	var saveApplication = function (id, firstName, lastName, email, school, grade, project, pid, cb) {
		db.registerApplication({
			uid: id,
			firstName: firstName,
			lastName: lastName,
			email: email,
			highschool: school,
			grade: grade,
			project: project,
			pid: pid,
			date: new Date()
		}, cb);	
	};

	var checkApplication = function (pid, uid, cb) {
		db.checkApplication({
			pid: pid,
			uid: uid
		}, cb);
	};

	return {
		getAllApplications: getAllApplications,
		saveApplication: saveApplication,
		checkApplication: checkApplication
	};

};

module.exports = SystemManager;