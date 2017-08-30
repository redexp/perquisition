var admin = require('express').Router();

admin.use(function (req, res, next) {
	if (!req.user || !req.user.hasRole('admin')) {
		res.status(401).send();
		return;
	}

	next();
});

admin.get('/', function (req, res) {
	res.redirect('/admin/users');
});

admin.use('/users', require('./users'));
admin.use('/teams', require('./teams'));

module.exports = admin;