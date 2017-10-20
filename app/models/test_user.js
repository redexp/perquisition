var TestUser = require('app/db/models/test_user');
var moment = require('moment');

module.exports = TestUser;

TestUser.find = function (testId, userId) {
	return TestUser.findOne({
		where: {
			test_id: testId,
			user_id: userId
		}
	});
};

TestUser.addStateProp = function (tests, user) {
	var p;

	if (tests.length === 0) {
		p = Promise.resolve([]);
	}
	else {
		p = TestUser.findAll({
			where: {
				test_id: {$in: tests.map(function (test) {
					return test.id;
				})},
				user_id: user.id
			}
		});
	}

	return p.then(function (list) {
		var hash = {};
		list.forEach(function (item) {
			hash[item.test_id] = item;
		});

		tests.forEach(function (test) {
			var item = hash[test.id];

			test.set('state', item ? item.state : 'not-tested', {raw: true});
			test.set('time', item ? item.time : null, {raw: true});
		});

		return tests;
	});
};

TestUser.setState = function (testId, userId, state) {
	return TestUser.find(testId, userId)
		.then(function (item) {
			var time = moment.utc().format('YYYY-MM-DD HH:mm:ss Z');

			if (item) {
				item.state = state;
				item.time = time;
				return item.save();
			}
			else {
				return TestUser.create({
					test_id: testId,
					user_id: userId,
					state: state,
					time: time
				});
			}
		})
	;
};