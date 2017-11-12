var license_key = require('express').Router();

module.exports = license_key;

license_key.get('/', function (req, res) {
	res.render('student/license-key', {
		licenseKey: req.user.license_key
	});
});

license_key.post('/used', function (req, res) {
	var user = req.user;
	if (user.license_key && !user.is_license_key_used) {
		user.is_license_key_used = true;
		user.save().then(function () {
			res.json(true);
		});
	}
	else {
		res.json(true);
	}
});