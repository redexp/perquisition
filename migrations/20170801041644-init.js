var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`CREATE TABLE public."session" 
			(
				sid VARCHAR(32) NOT NULL,
				expires TIMESTAMP NOT NULL,
				data TEXT
			)`,

			`ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE`,

			`CREATE TABLE public."user"
			(
				id SERIAL PRIMARY KEY,
				username VARCHAR(50),
				password VARCHAR(250),
				name VARCHAR(250),
				roles JSONB DEFAULT '[]' NOT NULL
			)`,

			`CREATE UNIQUE INDEX user_username_uindex ON public."user" (username)`,
		]);
	},

	down: function (db) {
		return queue(db, 'dropTable', [
			'session',
			'user'
		]);
	}
};
