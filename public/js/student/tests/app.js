require(['store', 'serverData'], function (store, serverData) {
	store.tests = serverData('tests');
});

require([
	'controllers/list',
	'controllers/test'
]);