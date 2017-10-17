define('declarative-view', ['view'], function (View) { return View; });

require(['markdown', 'highlight'], function (markdown, highlight) {
	markdown.setOptions({
		highlight: function (code, lang) {
			return lang ? highlight.highlight(lang, code, true).value : code;
		},
		langPrefix: 'hljs '
	});
});

require(['store', 'serverData'], function (store, serverData) {
	store.course = serverData('course');
	store.tests = serverData('tests');
});

require([
	'controllers/tests',
	'controllers/edit'
]);