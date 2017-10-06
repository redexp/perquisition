require(['store', 'serverData'], function (store, serverData) {
	store.course = serverData('course');
	store.course.chat = {
		id: 'name1',
		active: true
	};
});

require([
	'controllers/chat'
]);