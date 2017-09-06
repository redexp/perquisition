var users = require('express').Router();
var User = require('app/models/user');

module.exports = users;

users.get('/', function (req, res) {
	res.render('admin/users');
});

users.post('/search', function (req, res) {
	User.search(req.body).then(res.json, res.catch);
});

users.post('/create', function (req, res) {
	var data = req.body;

	var user = User.build(data);

	user.password = user.generatePassword(data.password);

	user
		.save()
		.then(setTeams(data.teams))
		.then(res.json, res.catch)
	;
});

users.post('/update', function (req, res) {
	var data = req.body;

	User
		.getById(data.id)
		.then(function (user) {
			return user.set(data).save();
		})
		.then(setTeams(data.teams))
		.then(User.removeFromCache)
		.then(res.json, res.catch)
	;
});

users.post('/delete', function (req, res) {
	User
		.getById(req.body.id)
		.then(function (user) {
			return user.destroy();
		})
		.then(res.json, res.catch)
	;
});

function setTeams(teams) {
	return function (user) {
		if (teams) {
			return user
				.setTeams(teams.map(function (team) {
					return team.id;
				}))
				.then(function () {
					return user;
				})
			;
		}

		return user;
	};
}