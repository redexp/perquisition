var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`CREATE TABLE public.test
			(
				id SERIAL PRIMARY KEY,
				course_id INT NOT NULL,
				title VARCHAR(500) NOT NULL,
				questions JSONB DEFAULT '[]' NOT NULL,
    			CONSTRAINT test_course_id_fk FOREIGN KEY (course_id) REFERENCES course (id) ON DELETE CASCADE
			)`,
			`CREATE INDEX test_course_id_index ON public.test (course_id)`,
		]);
	},

	down: function (db) {
		return queue(db.sequelize, 'query', [
			`DROP TABLE public.test`,
		]);
	}
};