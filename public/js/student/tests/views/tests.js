define('views/tests', [
	'view',
	'markdown',
	'dateFormat',
	'moment'
], function (
	View,
	markdown,
	dateFormat,
	moment
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

		this.listenOn(this.model('test'), '@state set/time', function () {
			if (this.timer) clearInterval(this.timer);

			if (!this.data.test.time) return;

			var view = this;
			var timeout;

			switch (this.data.test.state) {
			case 'tested':
				timeout = Math.round((moment.utc(this.data.test.time).add(1, 'day') - moment.utc()) / 1000);
				if (timeout > 0) {
					this.set('timeout', timeout);
					this.timer = setInterval(function () {
						view.set('timeout', view.data.timeout - 1);

						if (view.data.timeout <= 0) {
							view.model('test').set('testing', false);
							clearInterval(view.timer);
						}
					}, 1000);
				}
				else {
					this.model('test').set('state', 'not-tested');
				}
				break;

			case 'testing':
				timeout = Math.round((moment.utc() - moment.utc(this.data.test.time)) / 1000);
				this.set('timeout', timeout);
				this.timer = setInterval(function () {
					view.set('timeout', view.data.timeout + 1);
				}, 1000);
				break;
			}
		});
	}

	View.extend({
		constructor: Test,

		data: {
			timeout: 0
		},

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
				click: 'startTest',
				prop: {
					'disabled': {
						'@test.state': function (state) {
							return state === 'tested';
						}
					}
				}
			},

			'[data-state-title]': {
				visible: {
					'@test.state': function (state) {
						return function (node) {
							return node.attr('data-state-title') === state;
						};
					}
				}
			},

			'[data-timeout]': {
				visible: '@timeout',
				text: {
					'@timeout': dateFormat.hh_mm_ss
				}
			}
		}
	});

	return Tests;
});