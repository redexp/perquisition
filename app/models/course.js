var Course = require('app/db/models/course');

module.exports = Course;

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