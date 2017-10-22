define('views/homework', [
	'view',
	'markdown'
], function (
	View,
	markdown
) {

	function HomeworkForm() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: HomeworkForm,

		ui: {
			title: '[data-title]',
			description: '[data-description]'
		},

		template: {
			'@title': {
				html: {
					'=homework.title': markdown
				}
			},
			'@description': {
				html: {
					'=homework.description': markdown
				}
			}
		}
	});

	return HomeworkForm;
});