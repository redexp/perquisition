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

		addHomework: function () {
			this.callbacks.addHomework();
		},

		template: {
			'[data-list]': {
				each: {
					prop: 'list',
					view: Homework,
					dataProp: 'homework',
					removeClass: 'hidden'
				}
			},

			'[data-add-homework]': {
				click: 'addHomework'
			}
		}
	});

	function Homework() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Homework,

		editHomework: function () {
			this.parent.callbacks.editHomework(this.data.homework);
		},

		deleteHomework: function () {
			this.parent.callbacks.deleteHomework(this.data.homework);
		},

		template: {
			'[data-title]': {
				html: {
					'@homework.title': markdown
				}
			},

			'[data-edit]': {
				click: 'editHomework'
			},

			'[data-delete]': {
				click: 'deleteHomework'
			}
		}
	});

	return Homeworks;
});