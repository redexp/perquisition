var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public."user" ADD photo VARCHAR(100) NULL`,
			`ALTER TABLE public.course ADD online BOOLEAN DEFAULT FALSE NOT NULL`,
			`ALTER TABLE public.course ADD note TEXT DEFAULT '' NULL`
		]);
	},

	down: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public."user" DROP photo`,
			`ALTER TABLE public."course" DROP online`,
			`ALTER TABLE public."course" DROP note`,
		]);
	}
};