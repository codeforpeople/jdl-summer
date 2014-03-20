var DATABASE_URI = process.env.MONGOLAB_URI.toString().trim() || null;

var mongoose = require('mongoose');
var db = mongoose.connect(DATABASE_URI || 'mongodb://localhost/jdl-projects');

var participant = mongoose.Schema({
	name: String,
	surname: String,
	project_id: String
});

var project = mongoose.Schema({
	name: String,
	description: String,
	mentor: String,
});

mongoose.connection.once('open', function (err) {
	console.log('Connected to database!');
});

var User = db.model('user', user);
var Content = db.model('content', content);

function Database() {
	var database = {};

	/* add user to database */
	database.addUser = function (options, cb) {
		var user = new User(options);

		user.save(cb);
	}

	/* get users from database */
	database.findUser = function (options, cb) {
		if (typeof options == 'string') options = {username: options};
		if (typeof options == 'undefined') options = {};
		User.find(options, cb);
	}

	/* get all workspaces matching the options */
	database.getSection = function (options, cb) {
		if (typeof options == 'string') options = {section: options};
		if (typeof options == 'undefined') options = {};
		Content.find(options, cb);
	}

	database.getContent =function (cb) {
		Content.find({}, cb);
	}

	/* add a new workspace */
	database.addContent = function (options, cb) {
		var contentData = new Content(options);

		contentData.save(cb);
	}

	database.updateContent = function (section, new_data, cb) {
		Content.update({ section: section }, { data: new_data }, cb);
	}

	database.ObjectId = function () {
		return (new mongoose.Types.ObjectId()).valueOf();
	};

	return database;
}


module.exports = Database;