var app = require('app');
var homework = require('express').Router();
var Course = require('app/models/course');
var Homework = require('app/models/homework');

module.exports = homework;

homework.get('/:id/homework', Course.request({read: true}), function (req, res) {
	res.serverData.course = req.course.pick('id', 'title');

	Homework
		.findAll({
			attributes: ['id', 'course_id', 'title'],
			where: {
				course_id: req.course.id
			},
			order: [['id', 'ASC']]
		})
		.then(function (homeworks) {
			res.serverData.homeworks = homeworks;
			res.render('student/homework');
		})
	;
});

homework.post('/homework/description', Course.request({read: true}), function (req, res) {
	Homework
		.findOne({
			attributes: ['description'],
			where: {
				id: req.body.id,
				course_id: req.body.course_id
			}
		})
		.then(function (homework) {
			res.json(homework.description);
		})
		.catch(res.catch)
	;
});

app.get('/homework/:id', function (req, res) {
	Homework
		.findOne({
			where: {
				id: req.params.id,
				is_public: true
			}
		})
		.then(function (homework) {
			if (!homework) throw new Error('course.homework_not_found');

			res.serverData.homework = homework;
			res.render('student/public/homework');
		})
		.catch(res.catch)
	;
});