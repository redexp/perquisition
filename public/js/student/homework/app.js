require(['ajax'], function (ajax) {
	ajax.baseURL = '/student/courses/homework/';
});

require([
	'controllers/homework'
]);