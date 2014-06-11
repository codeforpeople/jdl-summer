
/*
 * GET home page.
 */

var fs = require('fs');

exports.index = function(req, res){

	var data = fs.readFileSync('./data/projects.json');
	data = JSON.parse(data);

	res.render('index', { title: 'Junior Development Labs', projects: data });
};