var db = require('app/db');
var TYPES = require('sequelize');

var Homework = db.define('homework', {
	title: {
		type: TYPES.STRING
	},
	description: {
		type: TYPES.STRING
	}
});

module.exports = Homework;