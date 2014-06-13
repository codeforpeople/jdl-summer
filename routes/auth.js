var auth = function (req, res) {

	var status = 0;

	if (req.session.passport.user !== undefined && req.session.passport.user.id !== 'undefined')
		status = 1;

	res.render('auth', { status: status, user: req.session.passport.user });
};

module.exports = auth;