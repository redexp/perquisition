define('views/test-form', [
	'views/form',
	'views/questions',
	'clone',
	'htmlToText'
], function (
	Form,
	Questions,
	clone,
	htmlToText
) {

	function TestForm() {
		Form.apply(this, arguments);

		var form = this;

		var questions = this.questions = new Questions({
			node: this.find('#questions')
		});

		['addQuestion', 'editQuestion', 'cloneQuestion', 'deleteQuestion', 'showUsers'].forEach(function (callback) {
			questions.callbacks[callback] = function () {
				form.callbacks[callback].apply(null, arguments);
			};
		});

		this.on('open', function (params) {
			this.test = params.test;
			questions.answers = params.test.answers;
			questions.model('questions').reset(clone(params.test.questions));
		});

		this.on('save', function (data) {
			data.id = this.test.id;
			data.course_id = this.test.course_id;
			data.title = htmlToText(this.ui.title);
			data.questions = clone(questions.data.questions);
		});
	}

	Form.extend({
		constructor: TestForm,

		ui: {
			title: '[data-test-title]'
		},

		clear: function () {
			this.questions.model('questions').removeAll();
		},

		cancel: function () {
			this.callbacks.cancel();
		},

		getValues: function () {
			return {};
		},

		template: {
			'@title': {
				html: {
					'open': function (params) {
						return htmlToText.undo(params.test.title);
					}
				}
			},

			'@submit': {
				click: 'submit'
			},

			'[data-cancel]': {
				click: 'cancel'
			}
		}
	});

	return TestForm;
});