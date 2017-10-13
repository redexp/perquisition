var Message = require('app/db/models/message');
var db = require('app/db');
var s = require('squel');
var moment = require('moment');

module.exports = Message;

Message.saveAll = function (messages) {
	return db.execute(
		s.insert()
		.into('message')
		.setFieldsRows(messages)
	);
};

Message.getTodayMessages = function (params) {
	var query = {
		time: {$gt: moment.utc().format('YYYY-MM-DD') + ' 00:00:00'}
	};

	if (params.course_id) {
		query.course_id = params.course_id;
	}

	return Message.findAll({
		where: query,
		order: [['time', 'ASC']]
	});
};