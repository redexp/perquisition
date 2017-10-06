var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public.course ADD status VARCHAR(15) NULL`,
		]);
	},

	down: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public.course DROP status`,
		]);
	}
};