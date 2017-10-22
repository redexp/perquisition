define('controllers/homework', [
	'views/homework-form',
	'steps',
	'ajax',
	'notify',
	'lang'
], function (
	HomeworkForm,
	steps,
	ajax,
	notify,
	__
) {

	var form = new HomeworkForm({
		node: '#homework-form'
	});

	form.callbacks.save = function (data) {
		return ajax('update', data).then(function (homework) {
			notify.success(__('main.saved'));
			steps('homeworks', homework);
		});
	};

	form.callbacks.cancel = function () {
		steps('homeworks');
	};

	steps.on('homework-form', function (homework) {
		form.open({homework: homework});
	});
});