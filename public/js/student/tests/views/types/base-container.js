define('views/types/base-container', [
	'view'
], function (
	View
) {

	function BaseContainer(options) {
		this.composer = options.composer;

		View.apply(this, arguments);
	}

	View.extend({
		constructor: BaseContainer,

		ui: {
			questions: '@root'
		},

		showAnswer: function (addAnswer) {
			this.views['@questions'].forEach(function (view) {
				view.showAnswer(addAnswer);
			});
		},

		template: {
			'@questions': {
				each: {
					prop: 'question.questions',
					view: function (question) {
						return this.composer.getQuestionView(question);
					},
					dataProp: 'question',
					node: false
				}
			}
		}
	});

	return BaseContainer;
});