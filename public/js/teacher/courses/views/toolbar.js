define('views/toolbar', [
	'view'
], function (
	View
) {

	function Toolbar() {
		View.apply(this, arguments);

		this.callbacks = {};
	}

	View.extend({
		constructor: Toolbar,

		addCourse: function () {
			this.callbacks.addCourse();
		},

		template: {
			'[data-add_course]': {
				on: {
					'click': 'addCourse'
				}
			}
		}
	});

	return Toolbar;
});