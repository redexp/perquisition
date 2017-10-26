require(['ajax'], function (ajax) {
	ajax.baseURL = '/teacher/courses/homework/';
});

require([
	'controllers/list',
	'controllers/homework'
]);