define('views/tests', [
	'view',
	'markdown'
], function (
	View,
	markdown
) {

	function Tests() {
		View.apply(this, arguments);
		this.callbacks = {};
	}

	View.extend({
		constructor: Tests,

		addTest: function () {
			this.callbacks.addTest();
		},

		template: {
			'[data-list]': {
				each: {
					prop: 'list',
					view: Test,
					dataProp: 'test',
					removeClass: 'hidden'
				}
			},

			'[data-add-test]': {
				click: 'addTest'
			}
		}
	});

	function Test() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Test,

		editTest: function () {
			this.parent.callbacks.editTest(this.data.test);
		},

		template: {
			'[data-status]': {
				visible: {
					'@test.status': function (status) {
						return function (node) {
							return node.attr('data-status') === status;
						};
					}
				}
			},

			'[data-title]': {
				html: function () {
					return markdown(this.data.test.title);
				}
			},

			'[data-edit]': {
				click: 'editTest'
			}
		}
	});

	return Tests;
});