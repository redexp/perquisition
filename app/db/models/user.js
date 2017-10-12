var db = require('app/db');
var TYPES = require('sequelize');

var User = db.define('user', {
	username: {
		type: TYPES.STRING,
		allowNull: false
	},
	password: {
		type: TYPES.STRING
	},
	name: {
		type: TYPES.STRING
	},
	roles: {
		type: TYPES.JSONB,
		defaultValue: []
	},
	photo: {
		type: TYPES.STRING
	},
	verification_code: {
		type: TYPES.STRING
	},
	verified: {
		type: TYPES.BOOLEAN,
		defaultValue: false
	},
	password_code: {
		type: TYPES.STRING
	}
});

module.exports = User;