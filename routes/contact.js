var mail = require('nodemailer').mail;

var contact = function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var content = req.body.content;

	mail({
		from: email,
		to: 'onea.alex@gmail.com',
		subject: 'JDL enquiry from ' + name + ' [sent via form]',
		text: content
	});

	res.render('contact');
};

module.exports = contact;