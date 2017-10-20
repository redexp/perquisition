var Test = require('app/db/models/test');

module.exports = Test;

Test.upsert = function (data) {
	if (data.id) {
		return Test.findById(data.id).then(function (test) {
			return test.update(data);
		});
	}
	else {
		return Test.create(data);
	}
};

Test.findByIdAndCourse = function (id, course) {
	return Test.findOne({
		where: {
			id: id,
			course_id: course.id
		}
	});
};