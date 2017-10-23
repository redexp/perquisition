define('htmlToText', ['jquery'], function ($) {

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
				.replace(/<br\/?>/g, "\n")
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

	htmlToText.undo = function (text) {
		if (!text && text !== 0) return '';

		var html = String(text).trim();

		if (!html) return html;

		html = html
			.replace(/^ +/gm, function (s) {
				return '&nbsp;'.repeat(s.length);
			})
			.replace(/<(\w+|)/g, function (x, tag) {
				return tag === 'img' || tag === 'br' ? x : '&lt;' + tag;
			})
		;

		html = '<p>' + html.replace(/\n/g, '</p><p>') + '</p>';

		html = html.replace(/<p><\/p>/g, '<p><br></p>');

		return html;
	};

	return htmlToText;
});