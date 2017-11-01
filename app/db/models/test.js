var db = require('app/db');
var TYPES = require('sequelize');

var Test = db.define('test', {
	status: {
		type: TYPES.STRING,
		defaultValue: 'draft'
	},
	title: {
		type: TYPES.STRING
	},
	questions: {
		type: TYPES.JSONB,
		defaultValue: []
	}
});

module.exports = Test;