define('controllers/tests', [
	'views/tests',
	'store',
	'steps',
	'ajax',
	'lang'
], function (
	Tests,
	store,
	steps,
	ajax,
	__
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
			status: 'draft',
			questions: []
		});
	};

	tests.callbacks.editTest = function (test) {
		steps('test-form', test);
	};

	tests.callbacks.deleteTest = function (test) {
		if (!confirm(__('main.are_you_sure'))) return;

		tests.model('list').remove(test);
		ajax('delete', {id: test.id, course_id: test.course_id});
	};

	steps.on('tests', function (params) {
		if (params && params.oldTest && params.newTest) {
			if (params.oldTest.id) {
				var item = tests.model('list').findWhere({id: params.oldTest.id});
				tests.model('list').replace(item, params.newTest);
			}
			else {
				tests.model('list').add(params.newTest);
			}
		}
	});
});