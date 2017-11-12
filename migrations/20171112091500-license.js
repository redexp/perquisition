var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public."user" ADD license_key VARCHAR(32) NULL`,
			`ALTER TABLE public."user" ADD is_license_key_used BOOLEAN DEFAULT FALSE NOT NULL`
		]);
	},

	down: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public."user" DROP license_key`,
			`ALTER TABLE public."user" DROP is_license_key_used`,
		]);
	}
};