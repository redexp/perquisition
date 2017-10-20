var db = require('app/db');
var TYPES = require('sequelize');

var TestUser = db.define('test_user', {
	state: {
		type: TYPES.STRING
	},
	time: {
		type: TYPES.DATE
	}
});

module.exports = TestUser;