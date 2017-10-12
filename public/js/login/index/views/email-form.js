define('views/email-form', [
	'views/modal-form'
], function (
	Form
) {

	function EmailForm() {
		Form.apply(this, arguments);
	}

	Form.extend({
		constructor: EmailForm,

		template: {
			'[data-description]': {
				text: {
					'open': function (params) {
						return params.description;
					}
				}
			},

			'[name="email"]': {
				prop: {
					'value': {
						'open': function () {
							return '';
						}
					}
				}
			}
		}
	});

	return EmailForm;
});