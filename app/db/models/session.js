var db = require('app/db');
var TYPES = require('sequelize');

module.exports = db.define('session', {
	sid: {
		type: TYPES.STRING(32),
		primaryKey: true
	},
	expires: {
		type: TYPES.DATE
	},
	data: {
		type: TYPES.TEXT
	}
});