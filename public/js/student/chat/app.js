require(['store', 'serverData'], function (store, serverData) {
	store.course = serverData('course');
	store.user = serverData('user');
	store.users = serverData('users');
	store.IS_MOBILE = isMobile();

	function isMobile() {
		if( navigator.userAgent.match(/Android/i)
			|| navigator.userAgent.match(/webOS/i)
			|| navigator.userAgent.match(/iPhone/i)
			|| navigator.userAgent.match(/iPad/i)
			|| navigator.userAgent.match(/iPod/i)
			|| navigator.userAgent.match(/BlackBerry/i)
			|| navigator.userAgent.match(/Windows Phone/i)
		){
			return true;
		}
		else {
			return false;
		}
	}
});

require(['markdown', 'highlight'], function (markdown, highlight) {
	markdown.setOptions({
		highlight: function (code, lang) {
			try {
				return lang ? highlight.highlight(lang, code, true).value : code;
			}
			catch (e) {
				console.error('Highlight error', e);
				return code;
			}
		},
		langPrefix: 'hljs '
	});
});

require([
	'controllers/chat'
]);