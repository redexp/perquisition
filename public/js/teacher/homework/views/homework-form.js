define('views/homework-form', [
	'views/form',
	'htmlToText',
	'jquery'
], function (
	Form,
	htmlToText,
	$
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
			data.is_public = Boolean(data.is_public);
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

		addImageFile: function (file) {
			if (file.type !== 'image/png' && file.type !== 'image/jpeg') return;

			var view = this;
			var reader = new FileReader();
			reader.onload = function () {
				view.addImage(reader.result);
			};
			reader.readAsDataURL(file);
		},

		addImage: function (data) {
			document.execCommand('insertHTML', false, $('<img>').attr('src', data).prop('outerHTML'));
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
				},
				on: {
					'drop': function (e) {
						e.preventDefault();
						this.addImageFile(e.originalEvent.dataTransfer.files[0]);
					}
				}
			},

			'[data-cancel]': {
				click: 'cancel'
			}
		}
	});

	return HomeworkForm;
});