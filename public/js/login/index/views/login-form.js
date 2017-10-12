define('views/login-form', [
	'views/form'
], function (
	Form
) {

	function LoginForm() {
		Form.apply(this, arguments);
	}

	Form.extend({
		constructor: LoginForm,

		forgotPassword: function () {
			this.callbacks.forgotPassword();
		},

		resendEmail: function () {
			this.callbacks.resendEmail();
		},

		template: {
			'[data-forgot-password]': {
				click: '!forgotPassword'
			},
			'[data-resend-email]': {
				click: '!resendEmail'
			}
		}
	});

	return LoginForm;
});