require(['store', 'serverData'], function (store, serverData) {
	store.perquisitions = serverData('perquisitions');
});

require([
	'controllers/list'
]);