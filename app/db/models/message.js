var db = require('app/db');
var TYPES = require('sequelize');

var Message = db.define('message', {
	uuid: {
		type: TYPES.STRING
	},
	user_name: {
		type: TYPES.STRING
	},
	text: {
		type: TYPES.TEXT
	},
	time: {
		type: TYPES.DATE
	}
});

module.exports = Message;