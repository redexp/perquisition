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
			this.model('questions').reset(params.test.questions);
		});


	}

	Form.extend({
		constructor: TestForm,

		data: function () {
			return {
				questions: [],
				types: [Row, Section, Choice]
			};
		},

		clear: function () {
			this.model('questions').removeAll();
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
			}
		}
	});

	return TestForm;
});