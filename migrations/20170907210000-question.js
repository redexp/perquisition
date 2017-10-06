var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`CREATE TABLE public.question
			(
				id SERIAL PRIMARY KEY,
				course_id INT NOT NULL,
				type VARCHAR(10) NOT NULL,
				title VARCHAR(250) NOT NULL,
				data JSONB NOT NULL
			)`,
			`ALTER TABLE public.question ADD CONSTRAINT question_course_id_fk FOREIGN KEY (course_id) REFERENCES course (id) ON DELETE CASCADE`,
		]);
	},

	down: function (db) {
		return db.dropTable('question');
	}
};