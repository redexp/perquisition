define('detachHTML', [], function () {

	return function detachHTML(id) {
		var node = document.getElementById(id);
		node.removeAttribute('id');
		var html = node.outerHTML;
		node.parentNode.removeChild(node);
		return html;
	};
});