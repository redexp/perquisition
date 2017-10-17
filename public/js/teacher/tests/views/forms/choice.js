define('views/forms/choice', [
	'view',
	'views/modal-form',
	'htmlToText',
	'clone',
	'uuid'
], function (
	View,
	Form,
	htmlToText,
	clone,
	uuid
) {

	function ChoiceForm() {
		Form.apply(this, arguments);

		this.on('open', function (params) {
			this.assign(clone(params.question), 'defaults');
		});

		this.on('@multiple', function (multiple) {
			var options = this.model('options');

			if (!multiple) {
				options.filterWhere({is_answer: true}).slice(1).forEach(function (option) {
					options.modelOf(option).set('is_answer', false);
				});
			}

			options.views.forEach(function (option) {
				option.set('type', multiple ? 'checkbox' : 'radio');
			});
		});

		this.on('save', function (data) {
			data.title = htmlToText(this.ui.title);
			data.multiple = !!data.multiple;
			data.options = this.model('options').views.map(function (view) {
				var option = view.data.option;
				return {
					uuid: option.uuid,
					is_answer: !!option.is_answer,
					text: htmlToText(view.ui.text)
				};
			});
		});
	}

	Form.extend({
		constructor: ChoiceForm,

		node: '#choice-form',

		ui: {
			title: '[data-title]'
		},

		data: function () {
			return {
				title: '',
				multiple: false,
				options: []
			};
		},

		addOption: function () {
			this.model('options').add({
				uuid: uuid(),
				is_answer: false,
				text: ''
			});
		},

		template: {
			'[data-title]': {
				html: {
					'@title': htmlToText.undo
				}
			},

			'[name="multiple"]': {
				connect: {
					'checked': 'multiple'
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

		ui: {
			text: '[data-text]'
		},

		data: function () {
			return {
				type: this.parent.data.multiple ? 'checkbox' : 'radio'
			};
		},

		deleteOption: function () {
			this.parent.model('options').remove(this.data.option);
		},

		template: {
			'[data-is_answer]': {
				connect: {
					'checked': 'option.is_answer'
				},
				attr: {
					'type': '@type'
				}
			},

			'[data-text]': {
				html: {
					'=option.text': htmlToText.undo
				}
			},

			'[data-delete]': {
				click: 'deleteOption'
			}
		}
	});

	return ChoiceForm;
});