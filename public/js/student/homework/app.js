require(['ajax'], function (ajax) {
	ajax.baseURL = '/student/courses/homework/';
});

require(['markdown', 'highlight'], function (markdown, highlight) {
	markdown.setOptions({
		highlight: function (code, lang) {
			return lang ? highlight.highlight(lang, code, true).value : code;
		},
		langPrefix: 'hljs '
	});
});

require([
	'controllers/homework'
]);