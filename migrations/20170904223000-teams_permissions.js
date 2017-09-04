var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public.course ADD teams_permissions JSONB DEFAULT '{}' NOT NULL`,
			`ALTER TABLE public.course DROP user_id`,
		]);
	},

	down: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public.course DROP teams_permissions`,
			`ALTER TABLE public.course ADD user_id INT`,
			`ALTER TABLE public.course ADD CONSTRAINT course_user_id_fk FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE`,
			`CREATE INDEX course_user_id_index ON public.course (user_id)`,
		]);
	}
};
