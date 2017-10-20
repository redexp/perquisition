var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`CREATE TABLE public.answer
			(
				id SERIAL PRIMARY KEY,
				test_id INT NOT NULL,
				user_id INT NOT NULL,
				answers JSONB DEFAULT '{}' NOT NULL,
				time TIMESTAMP NOT NULL,
				CONSTRAINT answer_test_id_fk FOREIGN KEY (test_id) REFERENCES test (id) ON DELETE CASCADE,
				CONSTRAINT answer_user_id_fk FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
			)`,
			`CREATE INDEX answer_test_id_index ON public.answer (test_id)`,
			`CREATE INDEX answer_user_id_index ON public.answer (user_id)`,
		]);
	},

	down: function (db) {
		return queue(db.sequelize, 'query', [
			`DROP TABLE public.answer`,
		]);
	}
};