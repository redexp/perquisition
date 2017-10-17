define('views/perquisitions', [
	'view'
], function (
	View
) {

	function Perquisitions() {
		View.apply(this, arguments);
		this.callbacks = {};
	}

	View.extend({
		constructor: Perquisitions,

		template: {
			'[data-list]': {
				each: {
					prop: 'list',
					view: Perquisition,
					dataProp: 'perquisition'
				}
			}
		}
	});

	function Perquisition() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Perquisition,

		startPerquisition: function () {
			this.parent.callbacks.startPerquisition(this.data.perquisition);
		},

		template: {
			'[data-title]': {
				text: '=perquisition.title'
			},

			'[data-start]': {
				click: 'startPerquisition'
			}
		}
	});

	return Perquisitions;
});