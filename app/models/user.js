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

			if (!user.validatePassword(password)) throw new Error('Wrong user password');

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

User.findByIDs = function (ids) {
	return User.findAll({
		where: {
			id: ids
		},
		order: [['id', 'ASC']]
	});
};

User.search = function (params) {
	var where = {};

	if (params.name) {
		where.name = {
			$iLike: '%' + params.name + '%'
		};
	}

	if (params.roles && params.roles.length > 0) {
		where.roles = {
			$or: params.roles.map(function (role) {
				return {
					$contains: role
				};
			})
		};
	}

	var method = params.hasOwnProperty('offset') || params.hasOwnProperty('limit') ? 'findAndCount' : 'findAll';

	return User[method]({
		attributes: {exclude: ['password']},
		where: where,
		offset: params.offset,
		limit: params.limit,
		order: [['name', 'ASC']]
	});
};

module.exports = User;