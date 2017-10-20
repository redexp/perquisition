define('controllers/test', [
	'views/test-form',
	'steps',
	'store',
	'ajax',
	'notify',
	'lang'
], function (
	TestForm,
	steps,
	store,
	ajax,
	notify,
	__
) {

	var form = new TestForm({
		node: '#test-form'
	});

	form.callbacks.save = function (data) {
		return ajax('/student/courses/test/answer', data).then(function (test) {
			notify.success(__('main.saved'));
			form.set('saved', true);
			store.trigger('tested', test);
		});
	};

	form.callbacks.cancel = function () {
		steps('tests');
	};

	steps.on('test-form', function (test) {
		form.clear();
		ajax('/student/courses/test/questions', {test_id: test.id, course_id: test.course_id}).then(function (questions) {
			test.questions = questions;
			form.open({test: test});
		});
	});
});