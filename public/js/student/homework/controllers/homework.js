define('controllers/homework', [
	'views/homeworks',
	'views/homework-form',
	'serverData',
	'ajax',
	'steps',
	'utils'
], function (
	Homeworks,
	HomeworkForm,
	serverData,
	ajax,
	steps,
	utils
) {

	var homeworks = new Homeworks({
		node: '#homeworks',
		data: {
			list: serverData('homeworks')
		}
	});

	var form = new HomeworkForm({
		node: '#homework-form'
	});

	form.callbacks.cancel = function () {
		steps('homeworks');
	};

	homeworks.callbacks.openHomework = function (homework) {
		ajax('description', utils.pick(homework, 'id', 'course_id'), function (description) {
			homework.description = description;
			steps('homework-form', homework);
		});
	};

	steps.on('homework-form', function (homework) {
		form.open({homework: homework});
	});
});