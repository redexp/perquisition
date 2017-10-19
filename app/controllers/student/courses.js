var courses = require('express').Router();
var Course = require('app/models/course');

module.exports = courses;

courses.get('/', function (req, res) {
	Course.findByUserOrTeams(req.user, req.user.getTeams())
		.then(function (courses) {
			res.serverData.courses = courses;
			res.render('student/courses');
		})
	;
});

courses.get('/:id', Course.request({read: true}), function (req, res) {
	res.serverData.course = req.course;
	res.render('student/course');
});

courses.get('/:id/chat', Course.request({read: true}));
courses.use('/:id/chat', require('./chat'));

courses.get('/:id/homework', Course.request({read: true}), function (req, res) {
	res.serverData.course = req.course;
	res.render('student/homework');
});

courses.use(require('./tests'));