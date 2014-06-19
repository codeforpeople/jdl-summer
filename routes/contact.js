var nodemailer = require('nodemailer');

var contact = function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var content = req.body.content;

	var smtpTransport = nodemailer.createTransport('SMTP', {
		service: 'Gmail',
		auth: {
			user: 'contact@jdl.ro',
			pass: process.env.CONTACT_DETAILS
		}
	});

	smtpTransport.sendMail({
		from: email,
		to: 'contact@jdl.ro',
		subject: 'JDL enquiry from ' + name + ' [' + email + '] [sent via form]',
		text: content
	});

	res.render('contact');
};

module.exports = contact;