define('declarative-view', ['view'], function (View) { return View; });

require(['store', 'serverData'], function (store, serverData) {
	store.course = serverData('course');
	store.tests = serverData('tests');
});

require([
	'controllers/tests',
	'controllers/edit'
]);