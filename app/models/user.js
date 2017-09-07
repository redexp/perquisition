var User = require('app/db/models/user');
var search = require('app/models/lib/search');
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

User.getById = User.findById;

User.setToCache = function (user) {
	return redis.setJSON('user-' + user.id, user).then(function () {
		return user;
	});
};

User.removeFromCache = function (user) {
	return redis.remove('user-' + user.id).then(function () {
		return user;
	});
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
	var teams = {association: 'teams'};

	if (params.name) {
		where.name = {
			$iLike: '%' + params.name + '%'
		};
	}

	if (params.name_or_username) {
		where.$or = [
			{name: {$iLike: '%' + params.name_or_username + '%'}},
			{username: {$iLike: '%' + params.name_or_username + '%'}},
		];
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

	if (params.team_id) {
		if (include.indexOf(teams) === -1) {
			include.push(teams);
		}

		teams.where = teams.where || {};

		teams.where.id = Number(params.team_id);
	}

	if (params.teams) {
		if (include.indexOf(teams) === -1) {
			include.push(teams);
		}
	}

	if (params.exclude) {
		where.id = {
			$notIn: params.exclude
		};
	}

	return User[search.method(params)]({
		where: where,
		include: include,
		offset: params.offset,
		limit: params.limit,
		order: [['name', 'ASC']]
	});
};

User.hook('beforeCount', function (options) {
	if (options.include && options.include.length > 0) {
		options.distinct = true;
	}
});

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