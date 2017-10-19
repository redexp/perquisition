define('views/types/base', [
	'view',
	'markdown'
], function (
	View,
	markdown
) {

	function Base(options) {
		this.composer = options.composer;

		View.apply(this, arguments);
	}

	View.extend({
		constructor: Base,

		template: {
			'[data-title]': {
				html: function () {
					return markdown(this.data.question.title);
				}
			}
		}
	});

	return Base;
});