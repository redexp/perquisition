var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public."user" ADD verification_code VARCHAR(36) NULL`,
			`ALTER TABLE public."user" ADD verified BOOLEAN DEFAULT FALSE NOT NULL`
		]);
	},

	down: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public."user" DROP verification_code`,
			`ALTER TABLE public."user" DROP verified`,
		]);
	}
};