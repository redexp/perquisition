var courses = require('express').Router();
var Course = require('app/models/course');


module.exports = courses;

courses.get('/', function (req, res) {
	Promise
		.all([
			Course.findByUser(req.user),
			Course.findByTeams(req.user.getTeams())
		])
		.then(function (list) {
			return list[0].concat(list[1]);
		})
		.then(function (courses) {
			res.serverData.courses = courses;
			res.render('student/courses');
		});
});

courses.get('/:id', getCourse({read: true}), function (req, res) {
	res.serverData.course = req.course;
	res.render('student/course');
});

courses.get('/:id/chat', getCourse({read: true}));
courses.use('/:id/chat', require('./chat'));

courses.get('/:id/homework', getCourse({read: true}), function (req, res) {
	res.serverData.course = req.course;
	res.render('student/homework');
});

function getCourse(perms) {
	return function (req, res, next) {
		Course.findUserCourse(req.params.id, req.user, perms)
			.then(function (course) {
				req.course = course;
				next();
			})
			.catch(res.catch)
		;
	};
}