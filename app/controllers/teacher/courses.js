var courses = require('express').Router();
var Course = require('app/models/course');
var User = require('app/models/user');
var Team = require('app/models/team');
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

	if (params.user_permission) {
		params.user_permission = req.user.id;
	}

	req.user.getTeams()
		.then(function (teams) {
			if (teams.length > 0) {
				params.teams_permissions = teams.map(function (team) {
					return {[team.id]: {read: true}};
				});
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

	Course.findById(data.id)
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