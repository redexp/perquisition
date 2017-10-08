var courses = require('express').Router();
var Course = require('app/models/course');
var faye = require('app/lib/faye');

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

courses.get('/:id', function (req, res) {
	Course.findUserCourse(req.params.id, req.user, {read: true})
		.then(function (course) {
			res.serverData.course = course;
			res.render('student/course');
		})
		.catch(res.catch)
	;
});

courses.get('/:id/chat', function (req, res) {
	var user = req.user;

	res.serverData.user = {
		id: user.id,
		name: user.name
	};

	Course.findUserCourse(req.params.id, req.user, {read: true})
		.then(function (course) {
			res.serverData.course = course;
			res.render('student/chat');
		})
		.catch(res.catch)
	;
});