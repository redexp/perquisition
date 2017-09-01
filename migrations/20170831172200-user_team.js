var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`CREATE TABLE public.user_team
			(
				user_id INT,
				team_id INT,
				CONSTRAINT user_team_user_id_fk FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE,
				CONSTRAINT user_team_team_id_fk FOREIGN KEY (team_id) REFERENCES team (id) ON DELETE CASCADE
			)`,
			`CREATE INDEX user_team_user_id_index ON public.user_team (user_id)`,
			`CREATE INDEX user_team_team_id_index ON public.user_team (team_id)`
		]);
	},

	down: function (db) {
		return db.dropTable('user_team');
	}
};