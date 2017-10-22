define('controllers/list', [
	'views/homeworks',
	'serverData',
	'steps',
	'ajax',
	'utils',
	'lang'
], function (
	Homeworks,
	serverData,
	steps,
	ajax,
	utils,
	__
) {

	var course = serverData('course');

	var homeworks = new Homeworks({
		node: '#homeworks',
		data: {
			list: serverData('homeworks')
		}
	});

	homeworks.callbacks.addHomework = function () {
		var homework = {
			course_id: course.id,
			title: '',
			description: ''
		};

		steps('homework-form', homework);
	};

	homeworks.callbacks.editHomework = function (homework) {
		ajax('description', utils.pick(homework, 'id', 'course_id'), function (description) {
			homework.description = description;
			steps('homework-form', homework);
		});
	};

	homeworks.callbacks.deleteHomework = function (homework) {
		if (!confirm(__('main.are_you_sure'))) return;
		homeworks.model('list').remove(homework);
		ajax('delete', utils.pick(homework, 'id', 'course_id'));
	};

	steps.on('homeworks', function (homework) {
		if (!homework) return;

		var model = homeworks.model('list').modelWhere({id: homework.id});

		if (model) {
			model.assign(homework);
		}
		else {
			homeworks.model('list').add(homework);
		}
	});
});