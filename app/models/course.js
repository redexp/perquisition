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
			var teams = params.permissions.teams || [];

			search.list(params, res).forEach(function (item) {
				var permissions = item.users_permissions[user] || {
					read: false,
					write: false,
					pass: false,
				};

				teams.forEach(function (id) {
					var perms = item.teams_permissions[id] || {};
					permissions.read = permissions.read || !!perms.read;
					permissions.write = permissions.write || !!perms.write;
					permissions.pass = permissions.pass || !!perms.pass;
				});

				item.set('permissions', permissions, {raw: true});
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

Course.findUserCourse = function (course, user, perms) {
	if (typeof course === 'object') {
		course = course.id;
	}

	if (typeof user === 'object') {
		user = user.id;
	}

	var permissions = [];

	['*', user].forEach(function (id) {
		var perm = {};

		for (var name in perms) {
			if (!perms.hasOwnProperty(name)) continue;

			perm[id + ',' + name] = perms[name] ? 'true' : 'false';
		}

		permissions.push(perm);
	});

	return Course.findOne({
		where: {
			id: course,
			users_permissions: {
				$or: permissions
			}
		}
	}).then(function (course) {
		if (!course) {
			throw new Error('course_access_denied');
		}

		return course;
	});
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
	})
};