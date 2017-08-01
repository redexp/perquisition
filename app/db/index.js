var Sequelize = require('sequelize');
var s = require('squel');
var config = require('./config').development;

/**
 * @type {Sequelize}
 */
var db = new Sequelize(config.database, config.username, config.password, {
	dialect: 'postgres',
	host: config.host,
	port: config.port,
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
	try {
		query = query.toParam();
	}
	catch (e) {
		return Promise.reject(e);
	}

	if (!type) {
		['Select', 'Insert', 'Update', 'Delete'].some(function (name) {
			if (query instanceof s.cls[name]) {
				type = db.QueryTypes[name.toUpperCase()];
				return true;
			}
		});
	}

    return db.query(query.text, {replacements: query.values, type: type});
};

module.exports = db;