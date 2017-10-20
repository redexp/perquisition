var db = require('app/db');
var TYPES = require('sequelize');

var Answer = db.define('answer', {
	answers: {
		type: TYPES.JSONB,
		defaultValue: {}
	},
	time: {
		type: TYPES.DATE
	}
});

module.exports = Answer;