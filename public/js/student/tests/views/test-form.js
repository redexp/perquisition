define('views/test-form', [
	'views/form',
	'views/types/row',
	'views/types/section',
	'views/types/choice'
], function (
	Form,
	Row,
	Section,
	Choice
) {

	function TestForm() {
		Form.apply(this, arguments);

		this.on('open', function (params) {
			this.test = params.test;
			this.model('questions').reset(params.test.questions);
		});

		this.on('save', function (data) {
			data.test_id = this.test.id;
			data.course_id = this.test.course_id;
			data.answers = {};

			function addAnswer(uuid, value) {
				data.answers[uuid] = value;
			}

			this.model('questions').views.forEach(function (view) {
				view.showAnswer(addAnswer);
			});
		});
	}

	Form.extend({
		constructor: TestForm,

		data: function () {
			return {
				saved: false,
				questions: [],
				types: [Row, Section, Choice]
			};
		},

		clear: function () {
			this.model('questions').removeAll();
			this.set('saved', false);
		},

		cancel: function () {
			this.callbacks.cancel();
		},

		getQuestionView: function (question) {
			var Class = this.data.types.find(function (item) {
				return item.id === question.type;
			});

			return new Class({
				composer: this,
				data: {
					question: question
				}
			});
		},

		template: {
			'[data-questions]': {
				each: {
					prop: 'questions',
					view: function (question) {
						return this.getQuestionView(question);
					},
					dataProp: 'question',
					node: false
				}
			},

			'@submit': {
				click: 'submit',
				prop: {
					'disabled': '@saved'
				}
			},

			'[data-cancel]': {
				visible: '@saved',
				click: 'cancel'
			}
		}
	});

	return TestForm;
});