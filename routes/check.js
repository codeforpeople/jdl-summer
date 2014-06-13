var check = function (req, res) {
	
	var result = {
		status: 1
	};

	var user = req.session.passport.user ? req.session.passport.user.id : null;

	// console.log(req.session);

	if (typeof user === 'undefined' || user === null)
		result.status = 0;

	result = JSON.stringify(result);
	res.end(result);
}

module.exports = check;