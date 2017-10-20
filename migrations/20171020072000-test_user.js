var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`CREATE TABLE public.test_user
			(
				test_id INT NOT NULL,
				user_id INT NOT NULL,
				state VARCHAR(20),
				CONSTRAINT test_user_test_id_fk FOREIGN KEY (test_id) REFERENCES test (id) ON DELETE CASCADE,
				CONSTRAINT test_user_user_id_fk FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE
			)`,
			`CREATE UNIQUE INDEX test_user_test_id_user_id_uindex ON public.test_user (test_id, user_id)`,
			`CREATE INDEX test_user_state_index ON public.test_user (state)`,
		]);
	},

	down: function (db) {
		return queue(db.sequelize, 'query', [
			`DROP TABLE public.test_user`,
		]);
	}
};