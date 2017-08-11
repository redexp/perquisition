var teacher = require('express').Router();

teacher.use(function (req, res, next) {
	if (!req.user || !req.user.hasRole('teacher')) {
		res.status(401).send();
		return;
	}

	next();
});

teacher.get('/', function (req, res) {
	res.redirect('/teacher/course/list');
});

teacher.use('/course', require('./course'));

module.exports = teacher;