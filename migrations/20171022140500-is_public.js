var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public.homework ADD is_public BOOLEAN DEFAULT TRUE NULL`,
		]);
	},

	down: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public.homework DROP is_public`,
		]);
	}
};