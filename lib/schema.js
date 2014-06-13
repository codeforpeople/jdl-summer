var mongoose = require('mongoose');

var mentor = mongoose.Schema({
	mid: String,
	firstname: String,
	surname: String,
	email: String,
	university: String,
	degree: String,
	year: Number,
	password: String,
	photo: {
		type: String,
		default: 'undefined'
	},
	status: {
		type: String, enum: ['pending', 'accepted'], 
		default: 'pending'
	},
	admin: {
		type: String, enum: ['yes', 'no'],
		default: 'no'
	}
});

var project = mongoose.Schema({
	pid: String,
	name: String,
	mentor: String,
	description: String,
	maxParticipants: Number
});

var student = mongoose.Schema({
	sid: String,
	name: String,
	email: String,
	highschool: String,
	grade: Number,
	projects: Array,
	assigned: {
		type: String,
		default: 'no'
	}
});

var application = mongoose.Schema({
	uid: String,
	firstName: String,
	lastName: String,
	email: String,
	highschool: String,
	grade: Number,
	project: String,
	pid: String,
	date: Date
});

module.exports.mentor = mentor;
module.exports.project = project;
module.exports.student = student;
module.exports.application = application;