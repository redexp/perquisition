var users = require('express').Router();
var User = require('app/models/user');

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

	user.save().then(res.json, res.catch);
});

users.post('/update', function (req, res) {
	var data = req.body;

	User.getById(data.id).then(function (user) {
		return user
			.set(data)
			.save()
			.then(function (user) {
				if (data.teams) {
					return user
						.setTeams(data.teams.map(function (team) {
							return team.id;
						}))
						.then(function () {
							return user;
						})
					;
				}

				return user;
			})
		;
	}).then(res.json, res.catch);
});

module.exports = users;