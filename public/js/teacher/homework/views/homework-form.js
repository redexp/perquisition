define('views/homework-form', [
	'views/form',
	'htmlToText'
], function (
	Form,
	htmlToText
) {

	function HomeworkForm() {
		Form.apply(this, arguments);

		this.on('open', function (params) {
			this.homework = params.homework;
			this.model('homework').assign(params.homework, 'default');
		});

		this.on('save', function (data) {
			data.id = this.homework.id;
			data.course_id = this.homework.course_id;
			data.title = htmlToText(this.ui.title);
			data.description = htmlToText(this.ui.description);
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
					'@homework.title': htmlToText.undo
				}
			},
			'@description': {
				html: {
					'@homework.description': htmlToText.undo
				}
			},

			'[data-cancel]': {
				click: 'cancel'
			}
		}
	});

	return HomeworkForm;
});