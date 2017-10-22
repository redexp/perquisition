var db = require('app/db');
var TYPES = require('sequelize');

var Homework = db.define('homework', {
	title: {
		type: TYPES.STRING
	},
	description: {
		type: TYPES.STRING
	},
	is_public: {
		type: TYPES.BOOLEAN,
		defaultValue: true
	}
});

module.exports = Homework;