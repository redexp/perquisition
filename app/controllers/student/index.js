var student = require('express').Router();

module.exports = student;

student.use(function (req, res, next) {
	if (!req.user.hasRole('student')) {
		res.status(403).send();
	}
	else {
		next();
	}
});

student.get('/', function (req, res) {
	res.redirect('/student/courses');
});

student.use('/courses', require('./courses'));
student.use('/stream', require('./stream'));