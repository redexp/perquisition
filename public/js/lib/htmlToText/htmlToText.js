define('htmlToText', ['jquery'], function ($) {

	return function htmlToText(domNode) {
		if (domNode instanceof $) {
			domNode = domNode.get(0);
		}

		var text = '';
		var nodes = domNode.childNodes;

		for (var i = 0, len = nodes.length; i < len; i++) {
			var node = nodes[i];

			text += node.textContent.replace(/\n/g, '');

			if (
				node.nodeType === 1 ||
				node.nodeType === 3 && nodes[i + 1] && nodes[i + 1].nodeType === 1
			) {
				text += "\n";
			}
		}

		return text.trim();
	};
});