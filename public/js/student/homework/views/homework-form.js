define('views/homework-form', [
	'views/form',
	'markdown'
], function (
	Form,
	markdown
) {

	function HomeworkForm() {
		Form.apply(this, arguments);

		this.on('open', function (params) {
			this.model('homework').assign(params.homework, 'default');
		});
	}

	Form.extend({
		constructor: HomeworkForm,

		ui: {
			title: '[data-title]',
			description: '[data-description]'
		},

		data: function () {
			return {
				homework: {
					title: '',
					description: ''
				}
			};
		},

		template: {
			'@title': {
				html: {
					'@homework.title': markdown
				}
			},
			'@description': {
				html: {
					'@homework.description': markdown
				}
			},

			'[data-cancel]': {
				click: 'cancel'
			}
		}
	});

	return HomeworkForm;
});