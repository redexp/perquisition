var teams = require('express').Router();
var Team = require('app/models/team');

module.exports = teams;

teams.get('/', function (req, res) {
	res.locals.serverData.query = req.query;
	res.render('admin/teams');
});

teams.post('/search', function (req, res) {
	Team.search(req.body).then(res.json, res.catch);
});

teams.post('/users', function (req, res) {
	Team.findById(req.body.id)
		.then(function (team) {
			return team.getUsers({
				order: [['name', 'ASC']]
			});
		})
		.then(res.json, res.catch)
	;
});

teams.post('/create', function (req, res) {
	var data = req.body;
	Team.create(data)
		.then(setUsers(data.users))
		.then(res.json, res.catch)
	;
});

teams.post('/update', function (req, res) {
	var data = req.body;
	Team.findById(data.id)
		.then(function (team) {
			return team.set(data).save().then(setUsers(data.users));
		})
		.then(res.json, res.catch)
	;
});

teams.post('/delete', function (req, res) {
	Team.findById(req.body.id)
		.then(function (team) {
			return team.destroy();
		})
		.then(res.json, res.catch)
	;
});

function setUsers(users) {
	return function (team) {
		return team
			.setUsers(users.map(function (user) {
				return user.id;
			}))
			.then(function () {
				return team;
			})
		;
	};
}