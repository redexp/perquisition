var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`CREATE TABLE public.homework
			(
				id SERIAL PRIMARY KEY,
				course_id INT NOT NULL,
				title VARCHAR(500) NOT NULL,
				description TEXT,
    			CONSTRAINT homework_course_id_fk FOREIGN KEY (course_id) REFERENCES course (id) ON DELETE CASCADE
			)`,
			`CREATE INDEX homework_course_id_index ON public.homework (course_id)`,
		]);
	},

	down: function (db) {
		return queue(db.sequelize, 'query', [
			`DROP TABLE public.homework`,
		]);
	}
};