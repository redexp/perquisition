define('declarative-view', ['view'], function (View) { return View; });

require(['ajax', 'store', 'serverData'], function (ajax, store, serverData) {
	ajax.baseURL = '/teacher/courses/test/';

	store.course = serverData('course');
	store.tests = serverData('tests');
});

require([
	'controllers/tests',
	'controllers/edit'
]);