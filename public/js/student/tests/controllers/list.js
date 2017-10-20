define('controllers/list', [
	'views/tests',
	'store',
	'steps',
	'ajax',
	'promise'
], function (
	Tests,
	store,
	steps,
	ajax,
	Promise
) {

	var tests = new Tests({
		node: '#tests',
		data: {
			list: store.tests
		}
	});

	tests.callbacks.startTest = function (test) {
		var p;

		if (test.state === 'testing') {
			p = Promise.resolve();
		}
		else {
			p = ajax('/student/courses/test/start', {id: test.id, course_id: test.course_id});
		}

		p.then(function () {
			tests.model('list').modelOf(test).set('state', 'testing');
			steps('test-form', test);
		});
	};

	store.on('tested', function (data) {
		var test = tests.model('list').findWhere({id: data.id});
		tests.model('list').modelOf(test).assign(data, 'default');
	});
});