var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public.course ADD video_url VARCHAR(500) NULL`,
			`ALTER TABLE public.course ADD chat_enabled BOOLEAN DEFAULT TRUE NULL`
		]);
	},

	down: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public."course" DROP video_url`,
			`ALTER TABLE public."course" DROP chat_enabled`,
		]);
	}
};