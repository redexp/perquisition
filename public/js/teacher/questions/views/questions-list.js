define('views/questions-list', [
	'view',
	'composer',
	'views/types/row',
	'views/types/section',
	'views/types/choice',
	'lang'
], function (
	View,
	Composer,
	Row,
	Section,
	Choice,
	__
) {

	function QuestionsList() {
		Composer.apply(this, arguments);

		this.callbacks = {};
	}

	Composer.extend({
		constructor: QuestionsList,

		ui: {
			components: '[data-questions]'
		},

		data: function () {
			return {
				componentsProp: 'questions',
				componentDataProp: 'question',
				componentTypeProp: 'type',
				questions: [],
				types: [
					{
						title: __('questions.row'),
						id:   Row.id,
						view: Row,
						data: Row.data
					},
					{
						title: __('questions.section'),
						id:   Section.id,
						view: Section,
						data: Section.data
					},
					{
						title: __('questions.choice'),
						id:   Choice.id,
						view: Choice,
						data: Choice.data
					}
				]
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

	function MenuItem() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: MenuItem,

		addQuestion: function () {
			this.parent.callbacks.addQuestion(this.data.type, this.parent);
		},

		template: {
			'[data-title]': {
				text: '=type.title',

				on: {
					'click': '!addQuestion'
				}
			}
		}
	});

	return QuestionsList;
});