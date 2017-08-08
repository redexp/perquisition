var crypt = require('bcrypt');
var User = require('app/db/models/user');
var redis = require('app/db/redis');

User.login = function (username, password) {
	return User
		.findOne({
			where: {
				username: username
			}
		})
		.then(function (user) {
			if (!user) throw new Error('User not found');

			if (!crypt.compareSync(password, user.get('password'))) throw new Error('Wrong user password');

			return user;
		})
		;
};

User.getById = function (id) {
	return User.findById(id);
};

User.setToCache = function (user) {
	return redis.setJSON('user-' + user.id, user);
};

User.getFromCache = function (id) {
	return redis.getJSON('user-' + id)
		.then(function (user) {
			if (!user) {
				return User.getById(id).then(function (user) {
					User.setToCache(user);
					return user;
				});
			}

			return User.build(user);
		})
	;
};

module.exports = User;