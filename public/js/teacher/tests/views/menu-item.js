define('views/menu-item', [
	'view'
], function (
	View
) {

	function MenuItem() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: MenuItem,

		addQuestion: function () {
			(this.parent.composer || this.parent).callbacks.addQuestion(this.data.type, this.parent);
		},

		template: {
			'[data-title]': {
				text: '=type.title',

				on: {
					'click': '!addQuestion'
				}
			}
		}
	});

	return MenuItem;
});