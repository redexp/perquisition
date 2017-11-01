define('views/questions', [
	'composer',
	'view',
	'views/menu-item',
	'views/types/row',
	'views/types/section',
	'views/types/choice'
], function (
	Composer,
	View,
	MenuItem,
	Row,
	Section,
	Choice
) {

	function Questions() {
		Composer.apply(this, arguments);

		this.callbacks = {};

		this.ui.arrow.appendTo('body');
	}

	Composer.extend({
		constructor: Questions,

		ui: {
			components: '[data-questions]'
		},

		data: function () {
			return {
				componentsProp: 'questions',
				componentDataProp: 'question',
				componentTypeProp: 'type',
				questions: [],
				types: [Choice, Row, Section].map(function (Class) {
					return {
						view:  Class,
						id:    Class.id,
						title: Class.title,
						data:  Class.data
					};
				})
			};
		},

		template: {
			'@toolbar': null,

			'[data-types]': {
				each: {
					prop: 'types',
					view: MenuItem,
					dataProp: 'type'
				}
			}
		}
	});

	return Questions;
});