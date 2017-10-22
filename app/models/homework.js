var Homework = require('app/db/models/homework');

module.exports = Homework;

Homework.upsert = function (data) {
	if (data.id) {
		return Homework.findById(data.id).then(function (homework) {
			return homework.update(data);
		});
	}
	else {
		return Homework.create(data);
	}
};