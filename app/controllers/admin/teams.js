var teams = require('express').Router();
var Team = require('app/models/team');

teams.post('/search', function (req, res) {
	Team.search(req.body).then(res.json, res.catch);
});

module.exports = teams;