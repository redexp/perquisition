define('controllers/profile', [
	'views/profile-form',
	'serverData',
	'ajax',
	'notify',
	'lang',
	'jquery'
], function (
	ProfileForm,
	serverData,
	ajax,
	notify,
	__,
	$
) {

	var form = new ProfileForm({
		node: '#profile-form',
		data: {
			user: serverData('user')
		}
	});

	form.callbacks.save = function (data) {
		var p;

		if (form.data.photoFile) {
			p = form.getPhotoBlob().then(function (blob) {
				data.photo = blob;
			});
		}
		else {
			p = $.Deferred().resolve().promise();
		}

		return p
			.then(function () {
				return ajax('/student/profile', data);
			})
			.then(function () {
				notify.success(__('main.saved'));
			})
		;
	};
});