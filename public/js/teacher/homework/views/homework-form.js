define('views/homework-form', [
	'views/form',
	'htmlToText',
	'markdown',
	'jquery'
], function (
	Form,
	htmlToText,
	markdown,
	$
) {

	function HomeworkForm() {
		Form.apply(this, arguments);

		this.on('open', function (params) {
			this.set('descriptionPreview', '');
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
				},
				descriptionPreview: ''
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

		previewDescription: function () {
			this.set('descriptionPreview', htmlToText(this.ui.description));
		},

		editDescription: function () {
			this.set('descriptionPreview', '');
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
				},
				hidden: '@descriptionPreview'
			},

			'[data-description-preview]': {
				html: {
					'@descriptionPreview': markdown
				}
			},

			'[data-preview-description]': {
				click: 'previewDescription',
				visible: '!@descriptionPreview'
			},

			'[data-edit-description]': {
				click: 'editDescription',
				visible: '@descriptionPreview'
			},

			'[data-cancel]': {
				click: 'cancel'
			}
		}
	});

	return HomeworkForm;
});