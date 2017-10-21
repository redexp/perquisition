var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public.test_user ADD time TIMESTAMP NULL`,
			`CREATE INDEX test_user_time_index ON public.test_user (time)`,
		]);
	},

	down: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public.test_user DROP time`,
		]);
	}
};