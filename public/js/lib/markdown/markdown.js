define('markdown', [
	'markdown-it',
	'highlight',
	'jquery'
], function (
	markdownIt,
	highlight,
	$
) {

	var md = markdownIt({
		html: true,
		linkify: true,
		langPrefix: 'hljs ',
		highlight: function (code, lang) {
			return lang ? highlight.highlight(lang, code, true).value : code;
		}
	});

	function markdown(text) {
		text = spoiler(text);

		return md.render(text);
	}

	function spoiler(text) {
		return text
			.replace(/<spoiler label="([^"]+)">/g, function (x, label) {
				return '<div class="spoiler"><label class="btn btn-sm btn-default">'+ label +' <i class="fa fa-caret-down"></i><i class="fa fa-caret-up"></i></label><div>';
			})
			.replace(/<\/spoiler>/g, '</div></div>')
		;
	}

	$('body').on('click', '.spoiler > label:first-child', function (e) {
		$(e.currentTarget).parent().toggleClass('open');
	});

	return markdown;
});