var tests = require('express').Router();
var Course = require('app/models/course');
var Test = require('app/models/test');

module.exports = tests;

tests.get('/:id/tests', Course.request({write: true}), function (req, res) {
	res.serverData.course = req.course;

	Test
		.findAll({
			attributes: ['id', 'course_id', 'title'],
			where: {
				course_id: req.course.id
			}
		})
		.then(function (tests) {
			res.serverData.tests = tests;
			res.render('teacher/tests');
		})
	;
});

tests.post('/test/questions', function (req, res) {
	Test
		.findOne({
			attributes: ['id', 'questions'],
			where: {id: Number(req.body.id)}
		})
		.then(function (test) {
			if (!test) throw new Error('course.test_not_found');

			return test.questions;
		})
		.then(res.json, res.catch)
	;
});

tests.post('/test', function (req, res) {
	Test.upsert(req.body)
		.then(res.json, res.catch)
	;
});