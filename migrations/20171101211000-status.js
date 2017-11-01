var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public.test ADD status VARCHAR(10) DEFAULT 'draft' NOT NULL`,
			`UPDATE public.test SET status = 'published'`,
			`ALTER TABLE public.homework ADD status VARCHAR(10) DEFAULT 'draft' NOT NULL`,
			`UPDATE public.homework SET status = 'published'`
		]);
	},

	down: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public.test DROP status`,
			`ALTER TABLE public.homework DROP status`,
		]);
	}
};