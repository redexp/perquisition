var db = require('app/db');
var TYPES = require('sequelize');

module.exports = db.define('question', {
	type: {
		type: TYPES.STRING
	},
	title: {
		type: TYPES.STRING
	},
	data: {
		type: TYPES.JSONB
	}
});