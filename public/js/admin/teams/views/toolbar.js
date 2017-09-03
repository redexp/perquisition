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

		addTeam: function () {
			this.callbacks.addTeam();
		},

		template: {
			'[data-add_team]': {
				on: {
					'click': 'addTeam'
				}
			}
		}
	});

	return Toolbar;
});