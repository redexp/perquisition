var app = require('app');
var student = require('express').Router();

module.exports = student;

student.use(function (req, res, next) {
	if (!req.user.hasRole('student') && !req.user.hasRole('teacher')) {
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
student.use('/profile', require('./profile'));

var fs = require('fs');

student.get('/photo/:filename', function (req, res) {
	var path = app.UPLOADS_DIR + '/photos/' + req.params.filename;
	if (fs.existsSync(path)) {
		res.sendFile(path);
	}
	else {
		res.status(404).send();
	}
});