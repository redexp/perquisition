define('views/questions', [
	'view',
	'views/types/row',
	'views/types/section',
	'views/types/text',
	'views/types/code'
], function (
	View,
	Row,
	Section,
	Text,
	Code
) {

	function Questions() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Questions,

		data: function () {
			return {
				questions: [],
				types: [Row, Section, Text, Code].reduce(function (hash, Class) {
					hash[Class.id] = Class;
					return hash;
				}, {})
			};
		},

		getQuestionView: function (data) {
			return this.data.types[data.id];
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

	return Questions;
});