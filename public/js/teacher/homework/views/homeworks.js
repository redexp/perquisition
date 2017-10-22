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
			'[data-is_public]': {
				visible: {
					'@homework.is_public': function (state) {
						state = state ? 'true' : 'false';
						return function (node) {
							return node.attr('data-is_public') === state;
						};
					}
				}
			},

			'[data-is_public="true"]': {
				attr: {
					'href': function () {
						return '/homework/' + this.data.homework.id;
					}
				}
			},

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