var courses = require('express').Router();
var Course = require('app/models/course');
var Test = require('app/models/test');
var User = require('app/models/user');
var Team = require('app/models/team');
var fayeClient = require('app/lib/faye').getClient();
var pick = require('lodash/pick');

module.exports = courses;

courses.get('/', function (req, res) {
	res.locals.serverData.user = pick(req.user, ['id', 'name']);

	res.render('teacher/courses');
});

courses.post('/search', function (req, res) {
	var params = req.body;

	params.users_permissions = {
		[req.user.id]: {read: true}
	};

	if (params.permissions) {
		params.permissions = {
			user: req.user,
			teams: []
		};
	}

	req.user.getTeams()
		.then(function (teams) {
			if (teams.length > 0) {
				params.teams_permissions = teams.map(function (team) {
					return {[team.id]: {read: true}};
				});
			}

			if (params.permissions) {
				params.permissions.teams = teams;
			}
		})
		.then(function () {
			return Course.search(params);
		})
		.then(res.json, res.catch)
	;
});

courses.post('/users', function (req, res) {
	Course.findById(req.body.id)
		.then(function (course) {
			return course.getUsers();
		})
		.then(res.json, res.catch)
	;
});

courses.post('/teams', function (req, res) {
	Course.findById(req.body.id)
		.then(function (course) {
			return course.getTeams();
		})
		.then(res.json, res.catch)
	;
});

courses.post('/users/search', function (req, res) {
	User.search(req.body).then(res.json, res.catch);
});

courses.post('/teams/search', function (req, res) {
	Team.search(req.body).then(res.json, res.catch);
});

courses.post('/create', function (req, res) {
	var course = req.body;

	Course.create(course)
		.then(res.json, res.catch)
	;
});

courses.post('/update', function (req, res) {
	var data = req.body;

	Course.findUserCourse(data.id, req.user, {write: true})
		.then(function (course) {
			return course.set(data).save();
		})
		.then(res.json, res.catch)
	;
});

courses.post('/delete', function (req, res) {
	Course.findById(req.body.id)
		.then(function (course) {
			return course.destroy();
		})
		.then(res.json, res.catch)
	;
});

courses.post('/chat-enabled', function (req, res) {
	Course.findUserCourse(req.body.id, req.user, {write: true})
		.then(function (course) {
			course.chat_enabled = !!req.body.enabled;
			return course.save();
		})
		.then(function (course) {
			fayeClient.publish('/course/chat/user/' + course.id, {type: 'chat-enabled', enabled: course.chat_enabled});
			return pick(course, ['id', 'chat_enabled']);
		})
		.then(res.json, res.catch)
	;
});

courses.get('/:id/questions', Course.request({write: true}), function (req, res) {
	res.serverData.course = req.course;

	return req.course.getQuestions()
		.then(function (questions) {
			res.serverData.questions = questions;
			res.render('teacher/questions');
		})
	;
});

courses.use(require('./tests'));