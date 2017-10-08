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
	});

	return LoginForm;
});