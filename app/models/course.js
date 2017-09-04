var Course = require('app/db/models/course');
var User = require('app/models/user');
var Team = require('app/models/team');

module.exports = Course;

Course.search = function (params) {
	var where = {};

	if (params.title) {
		where.title = {
			$iLike: '%' + params.title + '%'
		};
	}

	if (params.exclude && params.exclude.length > 0) {
		where.id = {
			$notIn: params.exclude
		};
	}

	var method = params.hasOwnProperty('offset') && params.hasOwnProperty('limit') ? 'findAndCount' : 'findAll';

	return Course[method]({
		where: where,
		offset: params.offset,
		limit: params.limit,
		order: [['title', 'ASC']]
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