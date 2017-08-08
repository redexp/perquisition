var app = require('app');
var teacher = require('express').Router();
var Course = require('app/models/course');

teacher.use(function (req, res, next) {
	if (!req.user || !req.user.hasRole('teacher')) {
		res.status(401).send();
		return;
	}

	next();
});

teacher.get('/', function (req, res) {
	res.redirect('/teacher/courses');
});

teacher.get('/courses', function (req, res) {
	Course.findByUser(req.user).then(function (courses) {
		res.locals.serverData.courses = courses;

		res.render('teacher/courses');
	});
});

teacher.post('/add-course', function (req, res) {
	var course = req.body.course;

	course.user_id = req.user.id;

	Course.create(course)
		.then(res.json, res.catch)
	;
});

teacher.post('/update-course', function (req, res) {
	var data = req.body.course;

	Course.findUserCourse(req.user, data.id)
		.then(function (course) {
			if (course.get('user_id') )

			course.set(data);
			return course.save();
		})
		.then(res.json, res.catch)
	;
});

teacher.post('/remove-course', function (req, res) {
	Course.findUserCourse(req.user, req.body.id)
		.then(function (course) {
			return course.destroy();
		})
		.then(function () {
			res.json({success: true});
		}, res.catch)
	;
});

app.use('/teacher', teacher);