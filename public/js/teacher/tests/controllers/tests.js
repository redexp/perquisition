define('controllers/tests', [
	'views/tests',
	'store',
	'steps'
], function (
	Tests,
	store,
	steps
) {

	var course = store.course;

	var tests = new Tests({
		node: '#tests',
		data: {
			list: store.tests
		}
	});

	tests.callbacks.addTest = function () {
		steps('test-form', {
			course_id: course.id,
			title: '',
			questions: []
		});
	};

	tests.callbacks.editTest = function (test) {
		steps('test-form', test);
	};

	steps.on('tests', function (params) {
		if (params && params.oldTest && params.newTest) {
			if (params.oldTest.id && tests.model('list').findWhere({id: params.oldTest.id})) {
				tests.model('list').replace(params.oldTest, params.newTest);
			}
			else {
				tests.model('list').add(params.newTest);
			}
		}
	});
});