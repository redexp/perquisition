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
					text: htmlToText(view.ui.text),
					description: htmlToText(view.ui.description)
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
					'open': function (params) {
						return htmlToText.undo(params.question.title);
					}
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
					dataProp: 'option',
					add: function (div, view) {
						div.append(view.node);
						view.ui.text.focus();
					}
				}
			},

			'[data-add-option]': {
				click: 'addOption'
			}
		}
	});

	function Option() {
		View.apply(this, arguments);

		this.set('description', !!this.data.option.description);

		this.listenOn(this.model('option'), 'set/is_answer', function (checked) {
			if (!checked || this.parent.data.multiple) return;

			var view = this;

			this.parent.model('options').views.forEach(function (item) {
				if (item === view) return;

				item.model('option').set('is_answer', false);
			});
		});
	}

	View.extend({
		constructor: Option,

		ui: {
			text: '[data-text]',
			description: '[data-description]'
		},

		data: function () {
			return {
				type: this.parent.data.multiple ? 'checkbox' : 'radio',
				description: false
			};
		},

		toggleDescription: function () {
			this.set('description', !this.data.description);

			if (this.data.description) {
				this.ui.description.focus();
			}
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

			'[data-toggle-description]': {
				click: 'toggleDescription'
			},

			'[data-description]': {
				visible: '@description',
				html: {
					'=option.description': htmlToText.undo
				}
			},

			'[data-delete]': {
				click: 'deleteOption'
			}
		}
	});

	return ChoiceForm;
});