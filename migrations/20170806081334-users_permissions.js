module.exports = {
	up: function (db) {
		return db.sequelize.query(`
			ALTER TABLE public.course ADD users_permissions JSONB DEFAULT '{}' NOT NULL
		`);
	},

	down: function (db) {
		return db.sequelize.query(`ALTER TABLE public.course DROP users_permissions`);
	}
};
