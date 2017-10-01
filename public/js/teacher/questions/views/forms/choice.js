define('views/forms/choice', [
	'view',
	'views/forms/base',
	'views/types/choice',
	'clone'
], function (
	View,
	Form,
	Choice,
	clone
) {

	ChoiceForm.id = Choice.id;

	function ChoiceForm() {
		Form.apply(this, arguments);

		this.on('open', function (params) {
			var question = params.question;

			this.model('question').assign(question, 'defaults');
			this.model('options').reset(clone(question.data.options));
		});

		this.on('save', function (data) {
			data.title = this.data.question.title;
			data.data = data.data || {};

			data.data.multiple = !!data.data.multiple;
			data.data.options = clone(this.data.options);
		});
	}

	Form.extend({
		constructor: ChoiceForm,

		data: function () {
			return {
				question: {
					title: '',
					data: {
						multiple: false
					}
				},
				options: []
			};
		},

		addOption: function () {
			this.model('options').add({
				title: ''
			});
		},

		template: {
			'[name="data[multiple]"]': {
				prop: {
					'checked': '@question.data.multiple'
				}
			},

			'[data-options]': {
				each: {
					prop: 'options',
					view: Option,
					dataProp: 'option'
				}
			},

			'[data-add-option]': {
				click: 'addOption'
			}
		}
	});

	function Option() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Option,

		deleteOption: function () {
			this.parent.model('options').remove(this.data.option);
		},

		template: {
			'[data-option-answer]': {
				connect: {
					'checked': 'option.answer'
				}
			},

			'[data-option-title]': {
				connect: {
					'value': 'option.title'
				}
			},

			'[data-delete-option]': {
				click: 'deleteOption'
			}
		}
	});

	return ChoiceForm;
});