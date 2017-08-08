var db = require('app/db');
var TYPES = require('sequelize');

var Course = db.define('course', {
	title: {
		type: TYPES.STRING
	},
	users_permissions: {
		type: TYPES.JSONB,
		defaultValue: {}
	}
});

module.exports = Course;