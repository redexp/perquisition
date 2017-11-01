var homework = require('express').Router();
var Course = require('app/models/course');
var Homework = require('app/models/homework');

module.exports = homework;

homework.get('/:id/homework', Course.request({read: true}), function (req, res) {
	res.serverData.course = req.course.pick('id', 'title');

	Homework
		.findAll({
			attributes: ['id', 'course_id', 'title', 'status', 'is_public'],
			where: {
				course_id: req.course.id
			},
			order: [['id', 'ASC']]
		})
		.then(function (list) {
			res.serverData.homeworks = list;
			res.render('teacher/homework');
		})
	;
});

homework.post('/homework/description', Course.request({read: true}), function (req, res) {
	Homework
		.findById(req.body.id)
		.then(function (homework) {
			res.json(homework.description);
		})
		.catch(res.catch)
	;
});

homework.post('/homework/update', Course.request({read: true}), function (req, res) {
	Homework.upsert(req.body).then(res.json, res.catch);
});

homework.post('/homework/delete', Course.request({read: true}), function (req, res) {
	Homework
		.findById(req.body.id)
		.then(function (homework) {
			return homework.destroy();
		})
		.then(function () {
			res.json(true);
		})
		.catch(res.catch)
	;
});