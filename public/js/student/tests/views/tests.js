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

		template: {
			'[data-list]': {
				each: {
					prop: 'list',
					view: Test,
					dataProp: 'test',
					removeClass: 'hidden'
				}
			}
		}
	});

	function Test() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Test,

		startTest: function () {
			this.parent.callbacks.startTest(this.data.test);
		},

		template: {
			'[data-title]': {
				html: function () {
					return markdown(this.data.test.title);
				}
			},

			'[data-start-test]': {
				click: 'startTest'
			}
		}
	});

	return Tests;
});