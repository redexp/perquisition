define('views/types/base-container', [
	'views/types/base'
], function (
	Base
) {

	function BaseContainer() {
		Base.apply(this, arguments);
	}

	Base.extend({
		constructor: BaseContainer,

		template: {
			'[data-questions]': {
				each: {
					prop: 'question.data.questions',
					view: function (data) {
						return this.composer.getQuestionView(data);
					},
					dataProp: 'question',
					node: false
				}
			}
		}
	});

	return BaseContainer;
});