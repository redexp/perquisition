var Sequelize = require('sequelize');
var s = require('squel');
var config = require('app/config').db;

/**
 * @type {Sequelize}
 */
var db = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	port: config.port,
	dialect: config.dialect,
	logging: config.logging || (!!process.env.DB_LOG && console.log.bind(console)),
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	define: {
		timestamps: false,
		underscored: true,
		freezeTableName: true
	}
});

db.execute = function (query, type) {
	if (!type) {
		['Select', 'Insert', 'Update', 'Delete'].some(function (name) {
			if (query instanceof s.cls[name]) {
				type = db.QueryTypes[name.toUpperCase()];
				return true;
			}
		});
	}

	try {
		query = query.toParam();
	}
	catch (e) {
		return Promise.reject(e);
	}

    return db.query(query.text, {replacements: query.values, type: type});
};

var pick = require('lodash/pick');
db.Model.prototype.pick = function (props) {
	return pick(this, props instanceof Array ? props : Array.prototype.slice.call(arguments, 0));
};

db.Model.prototype.toJSON = function () {
	return this.get();
};

module.exports = db;

require('./relations');

require('pg').types.setTypeParser(1114, function (value) {
	return value;
});