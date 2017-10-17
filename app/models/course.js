var Course = require('app/db/models/course');
var User = require('app/models/user');
var Team = require('app/models/team');
var search = require('app/models/lib/search');

module.exports = Course;

Course.search = function (params) {
	var where = {};

	if (params.title) {
		where.title = {
			$iLike: '%' + params.title + '%'
		};
	}

	if (params.users_permissions) {
		where.users_permissions = {
			$contains: params.users_permissions
		};
	}

	if (params.teams_permissions) {
		where.teams_permissions = {
			$or: params.teams_permissions.map(function (perms) {
				return {
					$contains: perms
				}
			})
		};
	}

	if (where.users_permissions && where.teams_permissions) {
		where.$or = [
			{users_permissions: where.users_permissions},
			{teams_permissions: where.teams_permissions},
		];

		delete where.users_permissions;
		delete where.teams_permissions;
	}

	if (params.exclude && params.exclude.length > 0) {
		where.id = {
			$notIn: params.exclude
		};
	}

	return Course[search.method(params)]({
		where: where,
		offset: params.offset,
		limit: params.limit,
		order: [['title', 'ASC']]
	}).then(function (res) {
		if (params.permissions) {
			var user = params.permissions.user;
			var teams = params.permissions.teams;
			search.list(params, res).forEach(function (course) {
				course.set('permissions', course.getPermissions(user, teams), {raw: true});
			});
		}

		return res;
	});
};

Course.findByUser = function (user) {
	return Course.findAll({
		where: {
			users_permissions: {
				$or: [
					{'*,read': 'true'},
					{[user.id + ',read']: 'true'},
				]
			}
		},
		order: [['id', 'ASC']]
	});
};

Course.findUserCourse = function (id, user, perms) {
	return Course.findById(id).then(function (course) {
		if (!course) {
			throw new Error('course.not_found');
		}

		if (course.users_permissions[user.id] && comparePermission(perms, course.users_permissions[user.id])) {
			return course;
		}

		return user.getTeams().then(function (teams) {
			var permissions = course.getPermissions(user, teams);

			if (!comparePermission(perms, permissions)) throw new Error('course.not_found');

			return course;
		});
	});
};

Course.findByTeams = function (teams) {
	return Promise.resolve(teams).then(function (teams) {
		if (teams.length === 0) return [];

		return Course.findAll({
			where: {
				teams_permissions: {
					$or: teams.map(function (team) {
						return {[team.id + ',read']: 'true'};
					})
				}
			}
		});
	});
};

Course.request = function (perms) {
	var key = JSON.stringify(perms);
	var request = Course.request[key];

	if (!request) {
		request = Course.request[key] = function (req, res, next) {
			var id = req.params.id;
			var user = req.user;

			Course.findUserCourse(id, user, perms)
				.then(function (course) {
					if (!course) throw new Error('course.not_found');

					req.course = course;
					next();
				})
				.catch(res.catch)
			;
		};
	}

	return request;
};

Course.prototype.toJSON = function () {
	return this.get();
};

Course.prototype.getUsers = function () {
	return User.findAll({
		where: {
			id: {$in: Object.keys(this.users_permissions)}
		}
	})
};

Course.prototype.getTeams = function () {
	return Team.findAll({
		where: {
			id: {$in: Object.keys(this.teams_permissions)}
		}
	});
};

Course.prototype.getPermissions = function (user, teams) {
	var course = this;
	var permissions = mergePermissions({}, course.users_permissions[user.id]);

	teams.forEach(function (team) {
		mergePermissions(permissions, course.teams_permissions[team.id]);
	});

	return permissions;
};

function comparePermission(source, target) {
	for (var name in source) {
		if (target[name] !== source[name]) {
			return false;
		}
	}

	return true;
}

function mergePermissions(a, b) {
	b = b || {};

	a.read = a.read || !!b.read;
	a.write = a.write || !!b.write;
	a.pass = a.pass || !!b.pass;

	return a;
}