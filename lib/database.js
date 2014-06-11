var DATABASE_URI = process.env.MONGOLAB_URI || null;

if (DATABASE_URI)
	DATABASE_URI = DATABASE_URI.toString().trim();

var mongoose = require('mongoose');
var schema = require('./schema.js');
var db = mongoose.connect(DATABASE_URI);

mongoose.connection.once('open', function (err) {
	console.log('Connected to database!');
});

var Mentor = db.model('mentor', schema.mentor);
var Project = db.model('project', schema.project);
var Student = db.model('student', schema.student);

function Database() {
	var database = {};

	/* add mentor to database */
	database.registerMentor = function (options, cb) {
		var mentor = new Mentor(options);

		mentor.save(cb);
	};

	/* get mentors from database */
	database.findMentor = function (options, cb) {
		if (typeof options == 'string') options = {email: options};
		if (typeof options == 'undefined') options = {};
		Mentor.find(options, cb);
	};

	database.findAllMentors = function (cb) {
		Mentor.find({}, cb);
	};

	database.updateMentor = function (mid, updates, cb) {
		Mentor.update({mid: mid}, updates, cb);
	};

	/* get all projects matching the options */
	database.findProjectsByMentor = function (mentor, cb) {
		Project.find({mentor: mentor}, cb);
	};

	database.findAllProjects = function (cb) {
		Project.find({}, cb);
	};

	/* add a new project */
	database.addProject = function (options, cb) {
		var project = new Project(options);

		Project.save(cb);
	};

	database.addProjectForStudent = function (student, project, cb) {
		Student.update({ sid: student }, {$pushAll: {projects: [project]}}, {upsert : true}, cb);
	};

	database.registerStudent = function (options, cb) {
		var student = new Student(options);

		Student.save(cb);
	};

	database.findAllStudents = function (cb) {
		Student.find({}, cb);
	};	

	database.generateId = function () {
		return (new mongoose.Types.ObjectId()).valueOf();
	};

	return database;
}

module.exports = Database;