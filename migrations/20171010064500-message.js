var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`CREATE TABLE public.message
			(
				id SERIAL PRIMARY KEY,
				uuid VARCHAR(36) NOT NULL,
				course_id INT NOT NULL,
				user_id INT NOT NULL,
				user_name VARCHAR(250) NOT NULL,
				text TEXT NOT NULL,
				time TIMESTAMP NOT NULL,
				CONSTRAINT message_user_id_fk FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE,
				CONSTRAINT message_course_id_fk FOREIGN KEY (course_id) REFERENCES course (id) ON DELETE CASCADE
			)`,
			`CREATE INDEX message_time_index ON public.message (time DESC)`,
			`CREATE INDEX message_course_id_index ON public.message (course_id)`
		]);
	},

	down: function (db) {
		return queue(db.sequelize, 'query', [
			`DROP TABLE public."message"`,
		]);
	}
};