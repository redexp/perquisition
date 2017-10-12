define('controllers/index', [
	'views/login-form',
	'views/email-form',
	'ajax',
	'notify',
	'lang'
], function (
	LoginForm,
	EmailForm,
	ajax,
	notify,
	__
) {

	if (location.href.indexOf('verify') > -1) {
		notify.success(__('auth.verify'), {timeout: 10 * 1000});
	}
	else if (location.href.indexOf('verified') > -1) {
		notify.success(__('auth.verified'));
	}
	else if (location.href.indexOf('rejected') > -1) {
		notify.error(__('auth.rejected'));
	}

	var form = new LoginForm({
		node: '#login-form'
	});

	form.callbacks.save = function (data) {
		data.username = data.username.toLowerCase();

		return ajax('/login', data)
			.then(function () {
				location.reload();
			})
			.catch(function () {
				notify.error(__('auth.login_error'));
			})
		;
	};

	var emailForm = new EmailForm({
		node: '#email-form'
	});

	form.callbacks.forgotPassword = function () {
		emailForm.open({
			description: __('auth.forgot_password_description'),
			save: function (data) {
				return ajax('/forgot-password', data);
			}
		});
	};

	form.callbacks.resendEmail = function (email) {
		emailForm.open({
			description: __('auth.resend_email_description'),
			save: function (data) {
				return ajax('/resend-verification-email', data);
			}
		});
	};

});