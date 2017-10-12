var queue = require('app/db/lib/queue');

module.exports = {
	up: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public."user" ADD password_code VARCHAR(36) NULL`,
			`CREATE UNIQUE INDEX user_password_code_uindex ON public."user" (password_code)`,
			`CREATE UNIQUE INDEX user_verification_code_uindex ON public."user" (verification_code)`
		]);
	},

	down: function (db) {
		return queue(db.sequelize, 'query', [
			`ALTER TABLE public."user" DROP password_code`,
			`DROP INDEX user_verification_code_uindex`,
		]);
	}
};