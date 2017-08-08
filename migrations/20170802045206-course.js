var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`CREATE TABLE public.course
			(
				id SERIAL PRIMARY KEY,
				user_id INT,
				title VARCHAR(255),
				CONSTRAINT course_user_id_fk FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
			)`,

			`CREATE INDEX course_user_id_index ON public.course (user_id)`
		]);
	},

	down: function (db) {
		return db.dropTable('course');
	}
};
