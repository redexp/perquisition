var course = require('express').Router();
var Course = require('app/models/course');
var User = require('app/models/user');
var pick = require('lodash/pick');

course.get('/list', function (req, res) {
	res.locals.serverData.user = pick(req.user, ['id', 'name']);

	Course.findByUser(req.user)
		.then(function (courses) {
			res.locals.serverData.courses = courses;

			var users = courses
				.reduce(function (list, course) {
					return list.concat(Object.keys(course.users_permissions));
				}, [])
				.filter(function (id) {
					return id !== '*';
				})
			;

			return User.findByIDs(users).then(function (users) {
				res.locals.serverData.users = users.map(function (user) {
					return pick(user, ['id', 'name']);
				});
			});
		})
		.then(function () {
			res.render('teacher/courses');
		})
	;
});

course.post('/create', function (req, res) {
	var course = req.body.course;

	course.user_id = req.user.id;

	Course.create(course)
		.then(res.json, res.catch)
	;
});

course.post('/update', function (req, res) {
	var data = req.body.course;

	Course.findUserCourse(data, req.user, {write: true})
		.then(function (course) {
			if (course.get('user_id') )

				course.set(data);
			return course.save();
		})
		.then(res.json, res.catch)
	;
});

course.post('/delete', function (req, res) {
	Course.findUserCourse(req.body, req.user, {write: true})
		.then(function (course) {
			return course.destroy();
		})
		.then(function () {
			res.json({success: true});
		}, res.catch)
	;
});

module.exports = course;