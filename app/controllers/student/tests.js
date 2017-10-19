var tests = require('express').Router();
var Course = require('app/models/course');
var Test = require('app/models/test');

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