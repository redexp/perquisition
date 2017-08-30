var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`CREATE TABLE public.team
			(
				id SERIAL PRIMARY KEY,
				name VARCHAR(250) NOT NULL,
				role VARCHAR(10) NOT NULL
			)`,
			`CREATE UNIQUE INDEX team_name_uindex ON public.team (name)`,
			`CREATE INDEX team_role_index ON public.team (role)`
		]);
	},

	down: function (db) {
		return db.dropTable('team');
	}
};
