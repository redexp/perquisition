define('controllers/test', [
	'views/test-form',
	'steps',
	'ajax'
], function (
	TestForm,
	steps,
	ajax
) {

	var form = new TestForm({
		node: '#test-form'
	});

	form.callbacks.save = function (data) {

	};

	steps.on('test-form', function (test) {
		form.clear();
		ajax('/student/courses/test/questions', {test_id: test.id, course_id: test.course_id}).then(function (questions) {
			test.questions = questions;
			form.open({test: test});
		});
	});
});