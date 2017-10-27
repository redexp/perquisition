define('views/types/choice', [
	'views/types/base',
	'view',
	'detachHTML',
	'markdown',
	'lang'
], function (
	Base,
	View,
	detachHTML,
	markdown,
	__
) {

	function Choice() {
		Base.apply(this, arguments);
	}

	Choice.id = 'choice';
	Choice.data = function () {
		return {
			type: Choice.id,
			title: '',
			multiple: false,
			options: []
		};
	};
	Choice.title = __('question.choice');

	Base.extend({
		constructor: Choice,

		node: detachHTML(Choice.id),

		template: {
			'[data-title]': {
				html: {
					'@question.title': function (title) {
						return markdown(title);
					}
				}
			},

			'[data-options]': {
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

		showUsers: function () {
			var uuid = this.data.option.uuid;

			this.parent.composer.callbacks.showUsers(
				this.parent.composer.answers
					.filter(function (answer) {
						return !!answer.answers[uuid];
					})
			);
		},

		template: {
			'input': {
				attr: {
					'type': function () {
						return this.parent.data.question.multiple ? 'checkbox' : 'radio';
					},
					'name': function () {
						return 'view-' + this.parent.id;
					}
				},
				checked: '=option.is_answer'
			},

			'[data-answers-count]': {
				text: function () {
					var uuid = this.data.option.uuid;
					return this.parent.composer.answers.reduce(function (sum, answer) {
						return sum + (answer.answers[uuid] ? 1 : 0);
					}, 0);
				},
				click: '!showUsers'
			},

			'[data-text]': {
				html: function () {
					return markdown(this.data.option.text || '');
				}
			},

			'[data-description]': {
				html: function () {
					return markdown(this.data.option.description || '');
				},
				visible: '=option.description'
			}
		}
	});

	return Choice;
});