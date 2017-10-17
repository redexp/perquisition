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

courses.get('/:id/perquisition', Course.request({read: true}), function (req, res) {
	res.serverData.course = req.course.pick('id', 'title');
	req.course.getPerquisitions().then(function (perquisitions) {
		res.serverData.perquisitions = perquisitions;
		res.render('student/perquisition');
	});
});