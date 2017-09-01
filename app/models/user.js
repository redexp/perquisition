var User = require('app/db/models/user');
var redis = require('app/db/redis');
var crypt = require('bcrypt');
var omit = require('lodash/omit');

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
	var include = [];

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

	if (params.teams) {
		include.push('teams');
	}

	var method = params.hasOwnProperty('offset') || params.hasOwnProperty('limit') ? 'findAndCount' : 'findAll';

	return User[method]({
		where: where,
		include: include,
		offset: params.offset,
		limit: params.limit,
		order: [['name', 'ASC']]
	});
};

User.prototype.hasRole = function (role) {
	return this.get('roles').indexOf(role) > -1;
};

User.prototype.validatePassword = function (password) {
	return crypt.compareSync(password, this.password);
};

User.prototype.generatePassword = function (password) {
	return crypt.hashSync(password, 10);
};

User.prototype.toJSON = function () {
	return omit(this.get(), ['password']);
};

module.exports = User;