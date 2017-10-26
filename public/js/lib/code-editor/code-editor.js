require([
	'jquery'
], function (
	$
) {

	$('[data-code-editor]').on('keyup', function (e) {
		if (e.keyCode !== 13) return;

		var sel = getSelection();

		if (!sel) return;

		var node = $(sel.anchorNode);

		if (node.parent('[data-code-editor]').length === 0) return;

		var prev = node.prev();

		if (prev.length === 0) return;

		var tabs = prev.text().match(/^\s+/);

		if (!tabs || tabs[0].length === 0) return;

		document.execCommand('insertHTML', false, '&nbsp;'.repeat(tabs[0].length));
	});

	$('[data-code-editor]').on('keydown', function (e) {
		if (e.keyCode !== 9) return;

		var sel = getSelection();

		if (!sel) return;

		e.preventDefault();

		var first = $(sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentNode);
		var last = $(sel.focusNode.nodeType === 1 ? sel.focusNode : sel.focusNode.parentNode);

		if (first.parent('[data-code-editor]').length === 0) return;
		if (last.parent('[data-code-editor]').length === 0) return;

		if (first.index() > last.index()) {
			var x = first;
			first = last;
			last = x;
		}

		var nodes = first.index() === last.index() ? first : first.add(first.nextUntil(last)).add(last);

		if (nodes.length === 1) {
			document.execCommand('insertHTML', false, '&nbsp;');
			return;
		}

		if (!e.shiftKey) {
			nodes.each(function (i, node) {
				var text = node.firstChild;
				if (!text || text.nodeType !== 3) {
					text = document.createTextNode("\u00A0");
					if (node.firstChild) {
						node.insertBefore(text, node.firstChild);
					}
					else {
						node.appendChild(text);
					}
				}
				else {
					text.textContent = "\u00A0" + text.textContent;
				}
			});
		}
		else {
			nodes.each(function (i, node) {
				var text = node.firstChild;
				if (!text || text.nodeType !== 3) return;

				text.textContent = text.textContent.replace(/^[ \u00A0]/, '');
			});
		}
	});

	function getSelection() {
		if (!window.getSelection) return;
		var sel = window.getSelection();
		if (sel.rangeCount === 0) return;
		return sel;
	}
});