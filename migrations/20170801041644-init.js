module.exports = {
	up: function (db) {
		return [
			`CREATE TABLE public."session" 
			(
				sid VARCHAR(32) NOT NULL,
				expire TIMESTAMP NOT NULL,
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
		].reduce(function (p, query) {
			return p.then(function () {
				return db.sequelize.query(query);
			});
		}, Promise.resolve());
	},

	down: function (db) {
		return [
			'session',
			'user'
		].reduce(function (p, table) {
			return p.then(function () {
				return db.dropTable(table);
			});
		}, Promise.resolve());
	}
};
