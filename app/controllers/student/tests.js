var tests = require('express').Router();
var Course = require('app/models/course');
var Test = require('app/models/test');
var TestUser = require('app/models/test_user');
var Answer = require('app/models/answer');
var moment = require('moment');

module.exports = tests;

tests.get('/:id/tests', Course.request({read: true}), function (req, res) {
	res.serverData.course = req.course.pick('id', 'title');

	Test
		.findAll({
			attributes: ['id', 'course_id', 'title'],
			where: {
				course_id: req.course.id
			},
			order: [['id', 'ASC']]
		})
		.then(function (tests) {
			return TestUser.addStateProp(tests, req.user);
		})
		.then(function (tests) {
			res.serverData.tests = tests;
			res.render('student/tests');
		})
	;
});

tests.post('/test/questions', function (req, res) {
	Course
		.findUserCourse(req.body.course_id, req.user, {read: true})
		.then(function (course) {
			return Test
				.findOne({
					attributes: ['questions'],
					where: {
						id: req.body.test_id,
						course_id: course.id
					}
				})
			;
		})
		.then(function (test) {
			if (!test) throw new Error('course.test_not_found');

			res.json(test.questions);
		})
		.catch(res.catch)
	;
});

tests.post('/test/start', function (req, res) {
	var test = req.body;
	var user = req.user;

	Course
		.findUserCourse(test.course_id, user, {read: true})
		.then(function () {
			return TestUser.findOne({
				where: {
					test_id: test.id,
					user_id: user.id,
					state: 'tested',
					time: {$gt: moment.utc().subtract(1, 'day')}
				}
			});
		})
		.then(function (tested) {
			if (tested) throw new Error('student.already_tested');

			return TestUser.setState(test.id, user.id, 'testing');
		})
		.then(function () {
			res.json({success: true});
		})
		.catch(res.catch)
	;
});

tests.post('/test/answer', function (req, res) {
	var user = req.user;
	var data = req.body;

	data.user_id = user.id;
	data.time = moment.utc().format('YYYY-MM-DD HH:mm:ss Z');

	Course.findUserCourse(data.course_id, user, {read: true})
		.then(function (course) {
			return Test.findByIdAndCourse(data.test_id, course)
		})
		.then(function (test) {
			if (!test) throw new Error('student.test_not_found');

			return TestUser.findOne({
				where: {
					test_id: test.id,
					user_id: user.id,
					state: 'tested',
					time: {$gt: moment.utc().subtract(1, 'day')}
				}
			});
		})
		.then(function (answer) {
			if (answer) throw new Error('student.already_answered');

			return Answer.create(data);
		})
		.then(function () {
			return TestUser.setState(data.test_id, user.id, 'tested');
		})
		.then(function (item) {
			res.json({id: data.test_id, state: item.state, time: item.time});
		})
		.catch(res.catch)
	;
});