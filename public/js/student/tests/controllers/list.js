define('controllers/list', [
	'views/tests',
	'store',
	'steps'
], function (
	Tests,
	store,
	steps
) {

	var tests = new Tests({
		node: '#tests',
		data: {
			list: store.tests
		}
	});

	tests.callbacks.startTest = function (test) {
		steps('test-form', test);
	};
});