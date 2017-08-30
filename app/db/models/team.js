var db = require('app/db');
var TYPES = require('sequelize');

var Team = db.define('team', {
	name: {
		type: TYPES.STRING
	},
	role: {
		type: TYPES.STRING
	}
});

module.exports = Team;