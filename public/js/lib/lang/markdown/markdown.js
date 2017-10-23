define('markdown', [
	'marked',
	'highlight'
], function (
	marked,
	highlight
) {

	marked.setOptions({
		highlight: function (code, lang) {
			return lang ? highlight.highlight(lang, code, true).value : code;
		},
		langPrefix: 'hljs '
	});

	return function (html) {
		return marked(htmlToText(html));
	};

	function htmlToText(domNode) {
		if (domNode instanceof $) {
			domNode = domNode.get(0);
		}

		var text = '';
		var nodes = domNode.childNodes;

		for (var i = 0, len = nodes.length; i < len; i++) {
			var node = nodes[i];

			text += node.innerHTML
				.replace(/&nbsp;/g, ' ')
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.replace(/\n/g, '')
			;

			if (
				node.nodeType === 1 ||
				node.nodeType === 3 && nodes[i + 1] && nodes[i + 1].nodeType === 1
			) {
				text += "\n";
			}
		}

		return text;
	}
});