var db = require('app/db');
var TYPES = require('sequelize');
var crypt = require('bcrypt');
var omit = require('lodash/omit');

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
	}
});

User.prototype.hasRole = function (role) {
	return this.get('roles').indexOf(role) > -1;
};

User.prototype.validatePassword = function (password) {
	return crypt.compareSync(password, this.password);
};

User.prototype.generatePassword = function (password) {
	return crypt.hashSync(password, 10);
};

var toJSON = User.prototype.toJSON;

User.prototype.toJSON = function () {
	var data = toJSON.call(this);

	return omit(data, ['password']);
};

module.exports = User;