define('views/types/choice', [
	'views/types/base',
	'view',
	'detachHTML',
	'markdown'
], function (
	Base,
	View,
	detachHTML,
	markdown
) {

	function Choice() {
		Base.apply(this, arguments);
	}

	Choice.id = 'choice';

	Base.extend({
		constructor: Choice,
		
		node: detachHTML(Choice.id),

		ui: {
			options: '[data-options]'
		},

		showAnswer: function (addAnswer) {
			this.views['@options'].forEach(function (view) {
				view.showAnswer(addAnswer);
			});
		},

		template: {
			'@options': {
				each: {
					prop: 'question.options',
					view: Option,
					dataProp: 'option'
				}
			}
		}
	});

	function Option() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Option,

		data: {
			is_answer: false,
			is_error: false,
			is_success: false,
			disabled: false
		},

		showAnswer: function (addAnswer) {
			this.set('is_error', this.data.is_answer && !this.data.option.is_answer);
			this.set('is_success', this.data.option.is_answer);
			this.set('disabled', true);

			if (this.data.is_answer) {
				addAnswer(this.data.option.uuid, true);
			}
		},

		template: {
			'@root': {
				toggleClass: {
					'success': '@is_success',
					'error': '@is_error'
				}
			},

			'[data-is_answer]': {
				connect: {
					'checked': 'is_answer'
				},
				prop: {
					'disabled': '@disabled'
				},
				attr: {
					'type': function () {
						return this.parent.data.question.multiple ? 'checkbox' : 'radio';
					}
				}
			},

			'[data-text]': {
				html: function () {
					return markdown(this.data.option.text);
				}
			},

			'[data-description]': {
				html: function () {
					return markdown(this.data.option.description);
				},
				visible: {
					'@option.description set/is_success set/is_error': function () {
						return this.data.option.description && (this.data.is_success || this.data.is_error);
					}
				}
			}
		}
	});

	return Choice;
});