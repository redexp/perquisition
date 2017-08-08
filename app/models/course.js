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

Course.findUserCourse = function (user, id) {
	return Course.findOne({
		where: {
			id: id,
			user_id: user.id
		}
	});
};