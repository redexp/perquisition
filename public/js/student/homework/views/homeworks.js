define('views/homeworks', [
	'view',
	'markdown'
], function (
	View,
	markdown
) {

	function Homeworks() {
		View.apply(this, arguments);
		this.callbacks = {};
	}

	View.extend({
		constructor: Homeworks,

		template: {
			'[data-list]': {
				each: {
					prop: 'list',
					view: Homework,
					dataProp: 'homework',
					removeClass: 'hidden'
				}
			}
		}
	});

	function Homework() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Homework,

		openHomework: function () {
			this.parent.callbacks.openHomework(this.data.homework);
		},

		template: {
			'[data-title]': {
				html: {
					'@homework.title': markdown
				}
			},

			'[data-open]': {
				click: 'openHomework'
			}
		}
	});

	return Homeworks;
});