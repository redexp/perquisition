var tests = require('express').Router();
var Course = require('app/models/course');
var Test = require('app/models/test');
var Answer = require('app/models/answer');
var User = require('app/models/user');

module.exports = tests;

tests.get('/:id/tests', Course.request({write: true}), function (req, res) {
	res.serverData.course = req.course;

	Test
		.findAll({
			attributes: ['id', 'course_id', 'title', 'status'],
			where: {
				course_id: req.course.id
			},
			order: [['id', 'ASC']]
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

tests.post('/test/answers', function (req, res) {
	Answer
		.findAll({
			where: {test_id: Number(req.body.id)},
			order: [['time', 'ASC']]
		})
		.then(res.json, res.catch)
	;
});

tests.post('/test/users', function (req, res) {
	User
		.findAll({
			attributes: ['id', 'photo', 'name'],
			where: {id: {$in: req.body.ids}}
		})
		.then(res.json, res.catch)
	;
});

tests.post('/test/delete', Course.request({write: true}), function (req, res) {
	Test.findById(req.body.id)
		.then(function (test) {
			return test.destroy()
		})
		.then(function () {
			res.json(true);
		})
		.catch(res.catch)
	;
});

tests.post('/test', function (req, res) {
	Test.upsert(req.body)
		.then(res.json, res.catch)
	;
});