var db = require('app/db');
var TYPES = require('sequelize');

var Course = db.define('course', {
	title: {
		type: TYPES.STRING
	},
	users_permissions: {
		type: TYPES.JSONB,
		defaultValue: {}
	},
	teams_permissions: {
		type: TYPES.JSONB,
		defaultValue: {}
	},
	video_url: {
		type: TYPES.STRING
	},
	chat_enabled: {
		type: TYPES.BOOLEAN,
		defaultValue: true
	},
	status: {
		type: TYPES.STRING
	},
	online: {
		type: TYPES.BOOLEAN,
		defaultValue: false
	},
	note: {
		type: TYPES.STRING,
		defaultValue: ''
	}
});

module.exports = Course;